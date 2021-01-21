import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFactory } from './lumberjack-log-factory';
import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';
import { ScopedLumberjackLogger } from './scoped-lumberjack-logger.service';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends ScopedLumberjackLogger {
  scope = 'Test';

  criticalLogger = this.createCriticalLogger('').build();
  debugLogger = this.createDebugLogger('').build();
  errorLogger = this.createErrorLogger('').build();
  infoLogger = this.createInfoLogger('').build();
  traceLogger = this.createTraceLogger('').build();
  warningLogger = this.createWarningLogger('').build();
}

const fakeDate = new Date('2020-02-02T02:02:02.000Z');

describe(LumberjackLogger.name, () => {
  beforeEach(() => {
    lumberjackStub = jasmine.createSpyObj<LumberjackService>(LumberjackTimeService.name, ['log']);

    TestBed.configureTestingModule({
      providers: [{ provide: LumberjackService, useValue: lumberjackStub }],
    });

    const fakeTime = resolveDependency(LumberjackTimeService);
    spyOn(fakeTime, 'getUnixEpochTicks').and.returnValue(fakeDate.valueOf());
    logger = resolveDependency(TestLogger);
    logFactory = resolveDependency(LumberjackLogFactory);
  });

  let logFactory: LumberjackLogFactory;
  let logger: TestLogger;
  let lumberjackStub: jasmine.SpyObj<LumberjackService>;

  it('can create a critical logger', () => {
    logger.criticalLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createCriticalLog('').withScope(logger.scope).build());
  });

  it('can create a debug logger', () => {
    logger.debugLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createDebugLog('').withScope(logger.scope).build());
  });

  it('can create an error logger', () => {
    logger.errorLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createErrorLog('').withScope(logger.scope).build());
  });

  it('can create an info logger', () => {
    logger.infoLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createInfoLog('').withScope(logger.scope).build());
  });

  it('can create a trace logger', () => {
    logger.traceLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createTraceLog('').withScope(logger.scope).build());
  });

  it('can create a warning logger', () => {
    logger.warningLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(logFactory.createWarningLog('').withScope(logger.scope).build());
  });
});
