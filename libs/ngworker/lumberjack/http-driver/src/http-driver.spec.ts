import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';
import { LogDriver, LogDriverToken, LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';

import { HttpDriverConfig } from './http-driver-config.token';
import { HttpDriverModule } from './http-driver.module';
import { HttpDriver } from './http.driver';

describe(HttpDriver.name, () => {
  let httpDriver: LogDriver;
  let httpTestingController: HttpTestingController;
  const config: HttpDriverConfig = {
    storeUrl: 'api/json',
    origin: 'TEST_MODULE',
    retryOptions: { attempts: 5, delayMs: 250 },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LumberjackModule.forRoot(), HttpDriverModule.forRoot(config)],
    });

    [httpDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
    httpTestingController = resolveDependency(HttpTestingController);

    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(0));
  });

  describe('log to a http server using the right level', () => {
    [
      [LumberjackLogLevel.Critical, 'logCritical'],
      [LumberjackLogLevel.Debug, 'logDebug'],
      [LumberjackLogLevel.Error, 'logError'],
      [LumberjackLogLevel.Info, 'logInfo'],
      [LumberjackLogLevel.Trace, 'logTrace'],
      [LumberjackLogLevel.Warning, 'logWarning'],
    ].forEach(([level, logMethodName]) => {
      it('should send log to the configure url', () => {
        // tslint:disable-next-line: no-any
        (httpDriver as any)[logMethodName]('SOME LOG');
        const body = {
          logEntry: 'SOME LOG',
          level,
          origin: config.origin,
        };

        const req = httpTestingController.expectOne(config.storeUrl);
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(body);
      });
    });
  });

  it('should retry after two failure and then succeed', () => {
    httpDriver.logCritical('SOME LOG');
    const body = {
      logEntry: 'SOME LOG',
      level: LumberjackLogLevel.Critical,
      origin: config.origin,
    };

    const { retryOptions, storeUrl } = config;

    let req = httpTestingController.expectOne(storeUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);
    req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

    jasmine.clock().tick(retryOptions.delayMs);

    req = httpTestingController.expectOne(storeUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);
    req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

    jasmine.clock().tick(retryOptions.delayMs);

    req = httpTestingController.expectOne(config.storeUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);
  });

  it('should retry the config number of times after failures and then stop retrying', () => {
    httpDriver.logCritical('SOME LOG');
    const body = {
      logEntry: 'SOME LOG',
      level: LumberjackLogLevel.Critical,
      origin: config.origin,
    };

    const { retryOptions, storeUrl } = config;

    let req: TestRequest;

    for (let index = 0; index < retryOptions.attempts; index++) {
      req = httpTestingController.expectOne(storeUrl);
      expect(req.cancelled).toBeFalse();
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(body);
      req.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });

      jasmine.clock().tick(retryOptions.delayMs);
    }

    req = httpTestingController.expectOne(config.storeUrl);
    expect(req.cancelled).toBeTrue();
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });
});
