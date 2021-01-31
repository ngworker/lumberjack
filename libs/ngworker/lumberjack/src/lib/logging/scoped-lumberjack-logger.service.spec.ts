import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FakeTimeService, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilder } from './lumberjack-log.builder';
import { LumberjackService } from './lumberjack.service';
import { ScopedLumberjackLogger } from './scoped-lumberjack-logger.service';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends ScopedLumberjackLogger {
  readonly scope = 'Test';

  criticalLogger = this.createCriticalLogger('').build();
  debugLogger = this.createDebugLogger('').build();
  errorLogger = this.createErrorLogger('').build();
  infoLogger = this.createInfoLogger('').build();
  traceLogger = this.createTraceLogger('').build();
  warningLogger = this.createWarningLogger('').build();
}

const fakeDate = new Date('2020-02-02T02:02:02.000Z');

describe(ScopedLumberjackLogger.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });
    const fakeTime = resolveDependency(LumberjackTimeService) as FakeTimeService;
    fakeTime.setTime(fakeDate);
    logger = resolveDependency(TestLogger);
    const lumberjack = resolveDependency(LumberjackService);
    lumberjackLogSpy = jest.spyOn(lumberjack, 'log');
  });

  let logger: TestLogger;
  // let lumberjackStub: jest.Mocked<LumberjackService>;
  let lumberjackLogSpy: jest.SpyInstance<void, [LumberjackLog<void | LumberjackLogPayload>]>;

  it('can create a critical logger', () => {
    logger.criticalLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Critical, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a debug logger', () => {
    logger.debugLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Debug, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create an error logger', () => {
    logger.errorLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Error, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create an info logger', () => {
    logger.infoLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Info, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a trace logger', () => {
    logger.traceLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Trace, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a warning logger', () => {
    logger.warningLogger();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Warning, '')
        .withScope(logger.scope)
        .build()
    );
  });
});
