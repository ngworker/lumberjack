import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { createCriticalDriverLog, createDriverLog, repeatSideEffect, resolveDependency } from '@internal/test-util';
import {
  LogDriver,
  logDriverToken,
  LumberjackLogEntryLevel,
  LumberjackLogLevel,
  LumberjackModule,
} from '@ngworker/lumberjack';

import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverModule } from './http-driver.module';
import { HttpLogEntry } from './http-log-entry';
import { HttpDriver } from './http.driver';

function expectRequest(
  httpTestingController: HttpTestingController,
  options: HttpDriverOptions,
  level: LumberjackLogLevel = LumberjackLogLevel.Critical
) {
  const expectedBody = createHttpLogEntry(level, level, options.origin);

  const {
    request: { body, method },
  } = httpTestingController.expectOne(options.storeUrl);
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
}

function expectRequestToBeAborted(httpTestingController: HttpTestingController, options: HttpDriverOptions) {
  const { cancelled } = httpTestingController.expectOne(options.storeUrl);
  expect(cancelled).toBeTrue();
}

function expectFailingRequest(
  httpTestingController: HttpTestingController,
  options: HttpDriverOptions,
  level: LumberjackLogLevel = LumberjackLogLevel.Critical
) {
  const expectedBody = createHttpLogEntry(level, LumberjackLogLevel.Critical, options.origin);
  const { retryOptions, storeUrl } = options;
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

function createHttpLogEntry(formattedLog: string, level: LumberjackLogLevel, origin: string): HttpLogEntry {
  return {
    formattedLog,
    level,
    origin,
  };
}

describe(HttpDriver.name, () => {
  let httpDriver: LogDriver;
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

    [httpDriver] = (resolveDependency(logDriverToken) as unknown) as LogDriver[];
    httpTestingController = resolveDependency(HttpTestingController);

    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(0));
  });

  describe('log to a http server using the right level', () => {
    [
      { level: LumberjackLogLevel.Critical, logMethod: (driver: LogDriver) => driver.logCritical },
      { level: LumberjackLogLevel.Debug, logMethod: (driver: LogDriver) => driver.logDebug },
      { level: LumberjackLogLevel.Error, logMethod: (driver: LogDriver) => driver.logError },
      { level: LumberjackLogLevel.Info, logMethod: (driver: LogDriver) => driver.logInfo },
      { level: LumberjackLogLevel.Trace, logMethod: (driver: LogDriver) => driver.logTrace },
      { level: LumberjackLogLevel.Warning, logMethod: (driver: LogDriver) => driver.logWarning },
    ].forEach(({ level, logMethod }) => {
      it(`sends a ${level} log to the configured URL`, () => {
        const expectedDriverLog = createDriverLog(level, level as LumberjackLogEntryLevel);
        logMethod(httpDriver).call(httpDriver, expectedDriverLog);

        expectRequest(httpTestingController, options, expectedDriverLog.log.level);
      });
    });
  });

  it('retries after two failures and then succeeds', () => {
    const expectedDriverLog = createCriticalDriverLog(LumberjackLogLevel.Critical);

    httpDriver.logCritical(expectedDriverLog);

    repeatSideEffect(2, () => expectFailingRequest(httpTestingController, options, LumberjackLogLevel.Critical));

    expectRequest(httpTestingController, options);
  });

  it('retries the specified number of times after failures and then stops retrying', () => {
    const expectedDriverLog = createCriticalDriverLog(LumberjackLogLevel.Critical);

    httpDriver.logCritical(expectedDriverLog);
    const { retryOptions } = options;

    repeatSideEffect(retryOptions.maxRetries + 1, () =>
      expectFailingRequest(httpTestingController, options, LumberjackLogLevel.Critical)
    );

    expectRequestToBeAborted(httpTestingController, options);
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });
});
