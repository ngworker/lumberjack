import { HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';
import { LogDriver, LogDriverToken, LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';

import { HttpDriverOptions } from './http-driver-options';
import { HttpDriverModule } from './http-driver.module';
import { HttpLogEntry } from './http-log-entry';
import { HttpDriver } from './http.driver';

/**
 *
 * Make given times calls to a function
 *
 */
function repeat(times: number, fn: () => void): void {
  return Array(times).fill(undefined).forEach(fn);
}

function generateLogEntry(logEntry: string, level: LumberjackLogLevel, origin: string): HttpLogEntry {
  return {
    logEntry,
    level,
    origin,
  };
}

/**
 *
 * Flush the current fake http call with a service unavailable error
 *
 */
// tslint:disable-next-line: no-any
function failHttpWithErrorUnavailable(flush: (...args: any[]) => void) {
  flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
}

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
        const expectedBody = generateLogEntry('SOME LOG', level, options.origin);

        logMethod(httpDriver).call(httpDriver, 'SOME LOG');

        const {
          request: { body, method },
        } = httpTestingController.expectOne(options.storeUrl);
        expect(method).toEqual('POST');
        expect(body).toEqual(expectedBody);
      });
    });
  });

  it('retries after two failures and then succeed', () => {
    const expectedBody = generateLogEntry('SOME LOG', LumberjackLogLevel.Critical, options.origin);
    const { retryOptions, storeUrl } = options;
    let req: TestRequest;

    httpDriver.logCritical('SOME LOG');

    // fails twice, retries once
    repeat(2, () => {
      req = httpTestingController.expectOne(storeUrl);
      const {
        // tslint:disable-next-line: no-shadowed-variable
        request: { body, method },
        flush,
      } = req;
      expect(method).toEqual('POST');
      expect(body).toEqual(expectedBody);
      failHttpWithErrorUnavailable(flush.bind(req));
      jasmine.clock().tick(retryOptions.delayMs);
    });
    // retries once more and succeeds
    const {
      request: { body, method },
    } = httpTestingController.expectOne(options.storeUrl);
    expect(method).toEqual('POST');
    expect(body).toEqual(expectedBody);
  });

  it('retries the options number of times after failures and then stop retrying', () => {
    const expectedBody = generateLogEntry('SOME LOG', LumberjackLogLevel.Critical, options.origin);
    let req: TestRequest;
    const { retryOptions, storeUrl } = options;

    httpDriver.logCritical('SOME LOG');

    // Retries the configured number of times
    repeat(retryOptions.attempts - 1, () => {
      req = httpTestingController.expectOne(storeUrl);
      const {
        // tslint:disable-next-line: no-shadowed-variable
        cancelled,
        request: { method, body },
        flush,
      } = req;
      expect(cancelled).toBeFalse();
      expect(method).toEqual('POST');
      expect(body).toEqual(expectedBody);
      failHttpWithErrorUnavailable(flush.bind(req));
      jasmine.clock().tick(retryOptions.delayMs);
    });
    // It cancels any request after the attempts are exhausted
    const { cancelled } = httpTestingController.expectOne(options.storeUrl);
    expect(cancelled).toBeTrue();
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });
});
