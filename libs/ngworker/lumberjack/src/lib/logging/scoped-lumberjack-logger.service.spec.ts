import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
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
    lumberjackStub = jasmine.createSpyObj<LumberjackService>(LumberjackTimeService.name, ['log']);

    TestBed.configureTestingModule({
      providers: [{ provide: LumberjackService, useValue: lumberjackStub }],
    });

    const fakeTime = resolveDependency(LumberjackTimeService);
    spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
    logger = resolveDependency(TestLogger);
  });

  let logger: TestLogger;
  let lumberjackStub: jasmine.SpyObj<LumberjackService>;

  it('can create a critical logger', () => {
    logger.criticalLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Critical, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a debug logger', () => {
    logger.debugLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Debug, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create an error logger', () => {
    logger.errorLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Error, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create an info logger', () => {
    logger.infoLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Info, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a trace logger', () => {
    logger.traceLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Trace, '')
        .withScope(logger.scope)
        .build()
    );
  });

  it('can create a warning logger', () => {
    logger.warningLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(
      new LumberjackLogBuilder(resolveDependency(LumberjackTimeService), LumberjackLevel.Warning, '')
        .withScope(logger.scope)
        .build()
    );
  });
});
