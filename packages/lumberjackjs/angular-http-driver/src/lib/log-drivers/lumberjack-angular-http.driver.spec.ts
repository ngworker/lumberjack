import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VERSION } from '@angular/platform-browser';

import { createCriticalDriverLog, createDriverLog, createFakeTime, repeatSideEffect } from '@internal/core/test-util';
import { lumberjackLogDriverToken, provideLumberjack } from '@lumberjackjs/angular';
import {
  LumberjackLevel,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  LumberjackLogLevel,
  LumberjackLogPayload,
} from '@lumberjackjs/core';

import { LumberjackAngularHttpDriverOptions } from '../configuration/lumberjack-angular-http-driver.options';
import {
  provideLumberjackAngularHttpDriver,
  withHttpOptions,
} from '../configuration/provide-lumberjack-angular-http-driver';
import { LumberjackAngularHttpDriverError } from '../errors/lumberjack-angular-http-driver.error';
import { LumberjackAngularHttpLog } from '../logs/lumberjack-angular-http.log';

import { LumberjackAngularHttpDriver } from './lumberjack-angular-http.driver';

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
  { storeUrl }: LumberjackAngularHttpDriverOptions,
  expectedBody: LumberjackAngularHttpLog<HttpDriverPayload>
) {
  const {
    request: { body, method },
  } = httpTestingController.expectOne(storeUrl);
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
}

function expectRequestToBeDiscarded(
  httpTestingController: HttpTestingController,
  options: LumberjackAngularHttpDriverOptions
) {
  httpTestingController.expectNone(options.storeUrl);
}

function expectFailingRequest(
  httpTestingController: HttpTestingController,
  { retryOptions, storeUrl }: LumberjackAngularHttpDriverOptions,
  expectedBody: LumberjackAngularHttpLog<HttpDriverPayload>
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
): LumberjackAngularHttpLog<HttpDriverPayload> {
  return { formattedLog, log, origin };
}

describe(LumberjackAngularHttpDriver.name, () => {
  let httpDriver: LumberjackLogDriver<HttpDriverPayload>;
  let httpTestingController: HttpTestingController;
  const options: LumberjackAngularHttpDriverOptions = {
    origin: 'TEST_MODULE',
    retryOptions: { maxRetries: 5, delayMs: 250 },
    storeUrl: 'api/json',
  };
  const fakeTime = createFakeTime();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideLumberjack(),
        provideLumberjackAngularHttpDriver(withHttpOptions(options)),
        provideHttpClientTesting(),
      ],
    });

    [httpDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver<HttpDriverPayload>[];
    httpTestingController = TestBed.inject(HttpTestingController);

    jest.useFakeTimers();
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
        const expectedDriverLog = createDriverLog<HttpDriverPayload>(
          fakeTime.getUnixEpochTicks,
          logLevel,
          logLevel,
          '',
          'Test',
          analyticsPayload
        );

        logMethod(httpDriver).call(httpDriver, expectedDriverLog);

        expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
      });
    }
  );

  it('retries after two failures and then succeeds', () => {
    const expectedDriverLog = createCriticalDriverLog<HttpDriverPayload>(
      fakeTime.getUnixEpochTicks,
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
      fakeTime.getUnixEpochTicks,
      LumberjackLevel.Critical,
      '',
      'Test',
      analyticsPayload
    );

    httpDriver.logCritical(expectedDriverLog);
    const { retryOptions } = options;

    try {
      repeatSideEffect(retryOptions.maxRetries + 1, () =>
        expectFailingRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog))
      );
    } catch (error) {
      expect(error).toEqual(new LumberjackAngularHttpDriverError(`Failed after ${retryOptions.maxRetries} retries.`));
      expectRequestToBeDiscarded(httpTestingController, options);
    }
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
