import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FakeTimeService, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFactory } from './lumberjack-log-factory';
import { LumberjackService } from './lumberjack.service';
import { ScopedLumberjackLogger } from './scoped-lumberjack-logger.service';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends ScopedLumberjackLogger {
  readonly scope = 'Test';

  critical = (message: string): void => this.createCriticalLogger(message).build().call(this);

  debug = (message: string): void => this.createDebugLogger(message).build().call(this);

  error = (message: string): void => this.createErrorLogger(message).build().call(this);
  info = (message: string): void => this.createInfoLogger(message).build().call(this);
  trace = (message: string): void => this.createTraceLogger(message).build().call(this);
  warning = (message: string): void => this.createWarningLogger(message).build().call(this);
}

describe(ScopedLumberjackLogger.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });
    logger = resolveDependency(TestLogger);
    logFactory = resolveDependency(LumberjackLogFactory);
    const lumberjack = resolveDependency(LumberjackService);
    lumberjackLogSpy = jest.spyOn(lumberjack, 'log').mockImplementation(() => {});
  });

  let logFactory: LumberjackLogFactory;
  let logger: TestLogger;
  let lumberjackLogSpy: jest.SpyInstance<void, [LumberjackLog<void | LumberjackLogPayload>]>;

  it('can create a critical logger', () => {
    const testMessage = 'Critical message';

    logger.critical(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createCriticalLog(testMessage).withScope(logger.scope).build()
    );
  });

  it('can create a debug logger', () => {
    const testMessage = 'Debug message';

    logger.debug(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createDebugLog(testMessage).withScope(logger.scope).build()
    );
  });

  it('can create an error logger', () => {
    const testMessage = 'Error message';

    logger.error(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createErrorLog(testMessage).withScope(logger.scope).build()
    );
  });

  it('can create an info logger', () => {
    const testMessage = 'Info message';

    logger.info(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createInfoLog(testMessage).withScope(logger.scope).build()
    );
  });

  it('can create a trace logger', () => {
    const testMessage = 'Trace message';

    logger.trace(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createTraceLog(testMessage).withScope(logger.scope).build()
    );
  });

  it('can create a warning logger', () => {
    const testMessage = 'Warning message';

    logger.warning(testMessage);

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      logFactory.createWarningLog(testMessage).withScope(logger.scope).build()
    );
  });
});
