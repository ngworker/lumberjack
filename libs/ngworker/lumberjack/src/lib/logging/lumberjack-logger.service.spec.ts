import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  createCriticalLog,
  createDebugLog,
  createErrorLog,
  createInfoLog,
  createTraceLog,
  createWarningLog,
  resolveDependency,
} from '@internal/test-util';

import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends LumberjackLogger {
  static context = 'Test';

  criticalLogger = this.createCriticalLogger('').withScope(TestLogger.context).log();
  debugLogger = this.createDebugLogger('').withScope(TestLogger.context).log();
  errorLogger = this.createErrorLogger('').withScope(TestLogger.context).log();
  infoLogger = this.createInfoLogger('').withScope(TestLogger.context).log();
  traceLogger = this.createTraceLogger('').withScope(TestLogger.context).log();
  warningLogger = this.createWarningLogger('').withScope(TestLogger.context).log();
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
  });

  let logger: TestLogger;
  let lumberjackStub: jasmine.SpyObj<LumberjackService>;

  it('can create a critical logger', () => {
    logger.criticalLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createCriticalLog());
  });

  it('can create a debug logger', () => {
    logger.debugLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createDebugLog());
  });

  it('can create an error logger', () => {
    logger.errorLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createErrorLog());
  });

  it('can create an info logger', () => {
    logger.infoLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createInfoLog());
  });

  it('can create a trace logger', () => {
    logger.traceLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createTraceLog());
  });

  it('can create a warning logger', () => {
    logger.warningLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createWarningLog());
  });
});
