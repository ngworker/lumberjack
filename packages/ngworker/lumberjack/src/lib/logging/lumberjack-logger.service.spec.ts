import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/test-util';

import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';
import { provideLumberjack } from '../configuration/provide-lumberjack';

import { LumberjackLogFactory } from './lumberjack-log-factory';
import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends LumberjackLogger {
  readonly scope = 'Test';

  readonly critical = this.createCriticalLogger('').withScope(this.scope).build();
  readonly debug = this.createDebugLogger('').withScope(this.scope).build();
  readonly error = this.createErrorLogger('').withScope(this.scope).build();
  readonly info = this.createInfoLogger('').withScope(this.scope).build();
  readonly trace = this.createTraceLogger('').withScope(this.scope).build();
  readonly warning = this.createWarningLogger('').withScope(this.scope).build();
}

describe(LumberjackLogger.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), { provide: LumberjackTimeService, useClass: FakeTimeService }],
    });
    const lumberjack = TestBed.inject(LumberjackService);
    lumberjackLogSpy = jest.spyOn(lumberjack, 'log').mockImplementation(() => {
      /* do nothing */
    });

    logger = TestBed.inject(TestLogger);
    logFactory = TestBed.inject(LumberjackLogFactory);
  });

  let logFactory: LumberjackLogFactory;
  let logger: TestLogger;
  let lumberjackLogSpy: jest.SpyInstance<void, [LumberjackLog<void | LumberjackLogPayload>]>;

  it('can create a critical logger', () => {
    logger.critical();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createCriticalLog('').withScope(logger.scope).build());
  });

  it('can create a debug logger', () => {
    logger.debug();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createDebugLog('').withScope(logger.scope).build());
  });

  it('can create an error logger', () => {
    logger.error();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createErrorLog('').withScope(logger.scope).build());
  });

  it('can create an info logger', () => {
    logger.info();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createInfoLog('').withScope(logger.scope).build());
  });

  it('can create a trace logger', () => {
    logger.trace();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createTraceLog('').withScope(logger.scope).build());
  });

  it('can create a warning logger', () => {
    logger.warning();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(logFactory.createWarningLog('').withScope(logger.scope).build());
  });
});
