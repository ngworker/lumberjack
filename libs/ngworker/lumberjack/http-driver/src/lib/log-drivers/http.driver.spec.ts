import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { repeatSideEffect, resolveDependency } from '@internal/test-util';
import { LumberjackLevel, LumberjackLogDriver, lumberjackLogDriverToken, LumberjackModule } from '@ngworker/lumberjack';

import { HttpDriverModule } from '../configuration/http-driver.module';
import { HttpDriverOptions } from '../configuration/http-driver.options';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';

import { LumberjackHttpDriver } from './lumberjack-http.driver';

function expectRequest(
  httpTestingController: HttpTestingController,
  { origin, storeUrl }: HttpDriverOptions,
  level: LumberjackLevel = LumberjackLevel.Critical
) {
  const expectedBody: LumberjackHttpLog = { formattedLog: level, level, origin };

  const {
    request: { body, method },
  } = httpTestingController.expectOne(storeUrl);
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
}

function expectRequestToBeAborted(httpTestingController: HttpTestingController, options: HttpDriverOptions) {
  const { cancelled } = httpTestingController.expectOne(options.storeUrl);
  expect(cancelled).toBeTrue();
}

function expectFailingRequest(
  httpTestingController: HttpTestingController,
  { origin, retryOptions, storeUrl }: HttpDriverOptions,
  level: LumberjackLevel = LumberjackLevel.Critical
) {
  const expectedBody: LumberjackHttpLog = { formattedLog: level, level: LumberjackLevel.Critical, origin };
  const req = httpTestingController.expectOne(storeUrl);
  const {
    cancelled,
    request: { method, body },
  } = req;

  expect(cancelled).toBeFalse();
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
  respondWith503ServiceUnavailable(req);
  jasmine.clock().tick(retryOptions.delayMs);
}

function respondWith503ServiceUnavailable(request: TestRequest) {
  request.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
}

describe(LumberjackHttpDriver.name, () => {
  let httpDriver: LumberjackLogDriver;
  let httpTestingController: HttpTestingController;
  const options: HttpDriverOptions = {
    storeUrl: 'api/json',
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LumberjackModule.forRoot(), HttpDriverModule.withOptions(options)],
    });

    [httpDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
    httpTestingController = resolveDependency(HttpTestingController);

    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(0));
  });

  describe('logs to a web API using the right log level', () => {
    [
      { level: LumberjackLevel.Critical, logMethod: (driver: LumberjackLogDriver) => driver.logCritical },
      { level: LumberjackLevel.Debug, logMethod: (driver: LumberjackLogDriver) => driver.logDebug },
      { level: LumberjackLevel.Error, logMethod: (driver: LumberjackLogDriver) => driver.logError },
      { level: LumberjackLevel.Info, logMethod: (driver: LumberjackLogDriver) => driver.logInfo },
      { level: LumberjackLevel.Trace, logMethod: (driver: LumberjackLogDriver) => driver.logTrace },
      { level: LumberjackLevel.Warning, logMethod: (driver: LumberjackLogDriver) => driver.logWarning },
    ].forEach(({ level, logMethod }) => {
      it(`sends a ${level} level log to the configured URL`, () => {
        logMethod(httpDriver).call(httpDriver, level);

        expectRequest(httpTestingController, options, level);
      });
    });
  });

  it('retries after two failures and then succeeds', () => {
    httpDriver.logCritical(LumberjackLevel.Critical);

    repeatSideEffect(2, () => expectFailingRequest(httpTestingController, options, LumberjackLevel.Critical));

    expectRequest(httpTestingController, options);
  });

  it('retries the specified number of times after failures and then stops retrying', () => {
    httpDriver.logCritical(LumberjackLevel.Critical);
    const { retryOptions } = options;

    repeatSideEffect(retryOptions.maxRetries + 1, () =>
      expectFailingRequest(httpTestingController, options, LumberjackLevel.Critical)
    );

    expectRequestToBeAborted(httpTestingController, options);
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });
});
