import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VERSION } from '@angular/platform-browser';

import { createCriticalDriverLog, createDriverLog, repeatSideEffect, resolveDependency } from '@internal/test-util';
import {
  LumberjackLevel,
  LumberjackLogBuilder,
  LumberjackLogDriver,
  LumberjackLogDriverLog,
  lumberjackLogDriverToken,
  LumberjackLogLevel,
  LumberjackLogPayload,
  LumberjackModule,
  LumberjackTimeService,
} from '@ngworker/lumberjack';
import { resolve } from 'dns';

import { LumberjackHttpDriverModule } from '../configuration/lumberjack-http-driver.module';
import { LumberjackHttpDriverOptions } from '../configuration/lumberjack-http-driver.options';
import { LumberjackHttpLog } from '../logs/lumberjack-http.log';

import { LumberjackHttp2Driver } from './lumberjack-http-2.driver';

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
  expect(cancelled).toBeTrue();
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

  expect(cancelled).toBeFalse();
  expect(method).toEqual('POST');
  expect(body).toEqual(expectedBody);
  respondWith503ServiceUnavailable(req);
  jasmine.clock().tick(retryOptions.delayMs);
}

function respondWith503ServiceUnavailable(request: TestRequest) {
  request.flush('Service Unavailable', { status: 503, statusText: 'Service Unavailable' });
}

function createHttpDriverLog(
  { log, formattedLog }: LumberjackLogDriverLog<HttpDriverPayload>,
  origin: string = 'TEST_MODULE'
): LumberjackHttpLog<HttpDriverPayload> {
  return { formattedLog, log, origin };
}

describe(LumberjackHttp2Driver.name, () => {
  it('logs a trace', () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    const httpClient = resolveDependency(HttpClient);
    const ngZone = resolveDependency(NgZone);
    const httpDriver = new LumberjackHttp2Driver(
      httpClient,
      {
        identifier: 'HttpDriver',
        levels: [LumberjackLevel.Verbose],
        origin: 'HttpDriverTest',
        retryOptions: { delayMs: 250, maxRetries: 5 },
        storeUrl: '/test/api',
      },
      ngZone
    );
    const time = resolveDependency(LumberjackTimeService);
    const log = new LumberjackLogBuilder(time, LumberjackLevel.Trace, 'Test message').build();

    httpDriver.logTrace({ formattedLog: 'Formatted test message', log });

    expect(true).toBeTrue();
  });
});

describe(LumberjackHttp2Driver.name, () => {
  let httpDriver: LumberjackHttp2Driver<HttpDriverPayload>;
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

    [httpDriver] = (resolveDependency(
      lumberjackLogDriverToken
    ) as unknown) as LumberjackHttp2Driver<HttpDriverPayload>[];
    httpTestingController = resolveDependency(HttpTestingController);

    jasmine.clock().uninstall();
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(0));
  });

  describe('logs to a web API using the right log level', () => {
    ([
      [LumberjackLevel.Critical, (driver) => driver.logCritical],
      [LumberjackLevel.Debug, (driver) => driver.logDebug],
      [LumberjackLevel.Error, (driver) => driver.logError],
      [LumberjackLevel.Info, (driver) => driver.logInfo],
      [LumberjackLevel.Trace, (driver) => driver.logTrace],
      [LumberjackLevel.Warning, (driver) => driver.logWarning],
    ] as ReadonlyArray<
      [
        LumberjackLogLevel,
        (
          driver: LumberjackLogDriver<HttpDriverPayload>
        ) => (driverLog: LumberjackLogDriverLog<HttpDriverPayload>) => void
      ]
    >).forEach(([logLevel, logMethod]) => {
      it(`sends a ${logLevel} level log to the configured URL`, () => {
        const expectedDriverLog = createDriverLog<HttpDriverPayload>(logLevel, logLevel, '', 'Test', analyticsPayload);
        logMethod(httpDriver).call(httpDriver, expectedDriverLog);

        expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
      });
    });
  });

  it('sends a critical log to the configured URL', () => {
    const expectedDriverLog = createDriverLog<HttpDriverPayload>(
      LumberjackLevel.Critical,
      LumberjackLevel.Critical,
      '',
      'Test',
      analyticsPayload
    );
    httpDriver.logCritical(expectedDriverLog);

    expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
  });

  it('sends a debug log to the configured URL', () => {
    const expectedDriverLog = createDriverLog<HttpDriverPayload>(
      LumberjackLevel.Debug,
      LumberjackLevel.Debug,
      '',
      'Test',
      analyticsPayload
    );
    httpDriver.logDebug(expectedDriverLog);

    expectRequest(httpTestingController, options, createHttpDriverLog(expectedDriverLog));
  });

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
    jasmine.clock().uninstall();
  });
});
