import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VERSION } from '@angular/platform-browser';
import { createCriticalDriverLog, createDriverLog, repeatSideEffect, resolveDependency } from '@internal/test-util';
import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  lumberjackLogDriverToken,
  LumberjackLogLevel,
  LumberjackLogPayload,
  LumberjackModule,
} from '@ngworker/lumberjack';
import { LumberjackHttpDriverModule } from '../configuration/lumberjack-http-driver.module';
import { LumberjackHttpDriverOptions } from '../configuration/lumberjack-http-driver.options';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';
import { LumberjackHttpDriver } from './lumberjack-http.driver';

interface HttpDriverPayload extends LumberjackLogPayload {
  analytics: { [key: string]: unknown };
}

const analyticsPayload: HttpDriverPayload = {
  analytics: {
    angularVersion: VERSION.full,
  },
};

function expectRequest(
  httpTestingController: HttpTestingController,
  { storeUrl }: LumberjackHttpDriverOptions,
  expectedBody: LumberjackHttpLog<HttpDriverPayload>
) {
  const {
    request: { body, method },
  } = httpTestingController.expectOne(storeUrl);
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
}

function expectRequestToBeAborted(httpTestingController: HttpTestingController, options: LumberjackHttpDriverOptions) {
  const { cancelled } = httpTestingController.expectOne(options.storeUrl);
  expect(cancelled).toBeTruthy();
}

function expectFailingRequest(
  httpTestingController: HttpTestingController,
  { retryOptions, storeUrl }: LumberjackHttpDriverOptions,
  expectedBody: LumberjackHttpLog<HttpDriverPayload>
) {
  const req = httpTestingController.expectOne(storeUrl);
  const {
    cancelled,
    request: { method, body },
  } = req;

  expect(cancelled).toBeFalsy();
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
  respondWith503ServiceUnavailable(req);
  jest.advanceTimersByTime(retryOptions.delayMs);
}

function respondWith503ServiceUnavailable(request: TestRequest) {
  request.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
}

function createHttpDriverLog(
  { log, formattedLog }: LumberjackLogDriverLog<HttpDriverPayload>,
  origin = 'TEST_MODULE'
): LumberjackHttpLog<HttpDriverPayload> {
  return { formattedLog, log, origin };
}

describe(LumberjackHttpDriver.name, () => {
  let httpDriver: LumberjackLogDriver<HttpDriverPayload>;
  let httpTestingController: HttpTestingController;
  const options: LumberjackHttpDriverOptions = {
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/json',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(), LumberjackHttpDriverModule.withOptions(options), HttpClientTestingModule],
    });

    [httpDriver] = resolveDependency(lumberjackLogDriverToken) as unknown as LumberjackLogDriver<HttpDriverPayload>[];
    httpTestingController = resolveDependency(HttpTestingController);

    jest.useFakeTimers('modern');
  });

  describe.each([
    [LumberjackLevel.Critical, (driver) => driver.logCritical],
    [LumberjackLevel.Debug, (driver) => driver.logDebug],
    [LumberjackLevel.Error, (driver) => driver.logError],
    [LumberjackLevel.Info, (driver) => driver.logInfo],
    [LumberjackLevel.Trace, (driver) => driver.logTrace],
    [LumberjackLevel.Warning, (driver) => driver.logWarning],
  ] as ReadonlyArray<[LumberjackLogLevel, (driver: LumberjackLogDriver<HttpDriverPayload>) => (driverLog: LumberjackLogDriverLog<HttpDriverPayload>) => void]>)(
    'logs to a web API using the %s log level',
    (logLevel, logMethod) => {
      it('sends the driver log to the configured URL', () => {
        const expectedDriverLog = createDriverLog<HttpDriverPayload>(logLevel, logLevel, '', 'Test', analyticsPayload);

        logMethod(httpDriver).call(httpDriver, expectedDriverLog);

        expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
      });
    }
  );

  it('retries after two failures and then succeeds', () => {
    const expectedDriverLog = createCriticalDriverLog<HttpDriverPayload>(
      LumberjackLevel.Critical,
      '',
      'Test',
      analyticsPayload
    );

    httpDriver.logCritical(expectedDriverLog);

    repeatSideEffect(2, () =>
      expectFailingRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog))
    );

    expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
  });

  it('retries the specified number of times after failures and then stops retrying', () => {
    const expectedDriverLog = createCriticalDriverLog<HttpDriverPayload>(
      LumberjackLevel.Critical,
      '',
      'Test',
      analyticsPayload
    );

    httpDriver.logCritical(expectedDriverLog);
    const { retryOptions } = options;

    repeatSideEffect(retryOptions.maxRetries + 1, () =>
      expectFailingRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog))
    );

    expectRequestToBeAborted(httpTestingController, options);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
