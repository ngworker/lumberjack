import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  createDebugLog,
  createErrorLog,
  createInfoLog,
  createWarningLog,
  resolveDependency,
} from '@internal/test-util';

import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackService } from './lumberjack.service';
import { LumberjackTimeService } from './time';

@Injectable({
  providedIn: 'root',
})
export class TestLogger extends LumberjackLogger {
  static context = 'Test';

  debugLogger = this.createDebugLogger('', TestLogger.context);
  errorLogger = this.createErrorLogger('', TestLogger.context);
  infoLogger = this.createInfoLogger('', TestLogger.context);
  warningLogger = this.createWarningLogger('', TestLogger.context);
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

  it('can create a warning logger', () => {
    logger.warningLogger();

    expect(lumberjackStub.log).toHaveBeenCalledTimes(1);
    expect(lumberjackStub.log).toHaveBeenCalledWith(createWarningLog());
  });
});
