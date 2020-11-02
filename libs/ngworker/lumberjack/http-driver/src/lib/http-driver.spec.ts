import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { repeatFunctionCalls, resolveDependency } from '@internal/test-util';
import { LogDriver, LogDriverToken, LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';

import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverModule } from './http-driver.module';
import { HttpLogEntry } from './http-log-entry';
import { HttpDriver } from './http.driver';

describe(HttpDriver.name, () => {
  let httpDriver: LogDriver;
  let httpTestingController: HttpTestingController;
  const options: HttpDriverOptions = {
    storeUrl: 'api/json',
    origin: 'TEST_MODULE',
    retryOptions: { attempts: 5, delayMs: 250 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LumberjackModule.forRoot(), HttpDriverModule.withOptions(options)],
    });

    [httpDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
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
      it('sends a log to the configure url', () => {
        logMethod(httpDriver).call(httpDriver, 'SOME LOG');

        expectRequest(httpTestingController, options, level);
      });
    });
  });

  it('retries after two failures and then succeed', () => {
    httpDriver.logCritical('SOME LOG');

    repeatFunctionCalls(2, () => expectFailingRequest(httpTestingController, options));

    expectRequest(httpTestingController, options);
  });

  it('retries the options number of times after failures and then stop retrying', () => {
    httpDriver.logCritical('SOME LOG');
    const { retryOptions } = options;

    repeatFunctionCalls(retryOptions.attempts + 1, () => expectFailingRequest(httpTestingController, options));
    expectRequestToBeAborted(httpTestingController, options);
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });
});

function expectRequest(
  httpTestingController: HttpTestingController,
  options: HttpDriverOptions,
  level: LumberjackLogLevel = LumberjackLogLevel.Critical
) {
  const expectedBody = generateLogEntry('SOME LOG', level, options.origin);

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

function expectFailingRequest(httpTestingController: HttpTestingController, options: HttpDriverOptions) {
  const expectedBody = generateLogEntry('SOME LOG', LumberjackLogLevel.Critical, options.origin);
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

function generateLogEntry(logEntry: string, level: LumberjackLogLevel, origin: string): HttpLogEntry {
  return {
    logEntry,
    level,
    origin,
  };
}
