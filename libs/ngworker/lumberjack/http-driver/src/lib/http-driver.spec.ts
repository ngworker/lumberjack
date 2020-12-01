import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { repeatSideEffect, resolveDependency } from '@internal/test-util';
import { LogDriver, logDriverToken, LumberjackLevel, LumberjackModule } from '@ngworker/lumberjack';

import { HttpDriverModule } from './configuration/http-driver.module';
import { HttpDriverOptions } from './configuration/http-driver.options';
import { HttpLogEntry } from './http-log-entry';
import { HttpDriver } from './http.driver';

function expectRequest(
  httpTestingController: HttpTestingController,
  options: HttpDriverOptions,
  level: LumberjackLevel = LumberjackLevel.Critical
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
  level: LumberjackLevel = LumberjackLevel.Critical
) {
  const expectedBody = createHttpLogEntry(level, LumberjackLevel.Critical, options.origin);
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

function createHttpLogEntry(logEntry: string, level: LumberjackLevel, origin: string): HttpLogEntry {
  return {
    logEntry,
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
      { level: LumberjackLevel.Critical, logMethod: (driver: LogDriver) => driver.logCritical },
      { level: LumberjackLevel.Debug, logMethod: (driver: LogDriver) => driver.logDebug },
      { level: LumberjackLevel.Error, logMethod: (driver: LogDriver) => driver.logError },
      { level: LumberjackLevel.Info, logMethod: (driver: LogDriver) => driver.logInfo },
      { level: LumberjackLevel.Trace, logMethod: (driver: LogDriver) => driver.logTrace },
      { level: LumberjackLevel.Warning, logMethod: (driver: LogDriver) => driver.logWarning },
    ].forEach(({ level, logMethod }) => {
      it(`sends a ${level} log to the configured URL`, () => {
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
