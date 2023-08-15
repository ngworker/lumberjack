import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/angular/test-util';
import {
  createDebugLogBuilder,
  createErrorLogBuilder,
  createInfoLogBuilder,
  createTraceLogBuilder,
  createWarningLogBuilder,
  LumberjackLog,
  LumberjackLogPayload,
} from '@lumberjackjs/core';
import { createCriticalLogBuilder } from '@lumberjackjs/core';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogger } from './lumberjack-logger.service';
import { LumberjackOrchestrator } from './lumberjack-orchestrator.service';

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
      imports: [LumberjackModule.forRoot()],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });
    const lumberjack = TestBed.inject(LumberjackOrchestrator);
    timeService = TestBed.inject(LumberjackTimeService) as FakeTimeService;
    getUnixEpochTicks = timeService.getUnixEpochTicks.bind(timeService);
    lumberjackLogSpy = jest.spyOn(lumberjack, 'log').mockImplementation(() => {
      /* do nothing */
    });

    logger = TestBed.inject(TestLogger);
  });

  let timeService: FakeTimeService;
  let getUnixEpochTicks: () => number;
  let logger: TestLogger;
  let lumberjackLogSpy: jest.SpyInstance<void, [LumberjackLog<void | LumberjackLogPayload>]>;

  it('can create a critical logger', () => {
    logger.critical();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createCriticalLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });

  it('can create a debug logger', () => {
    logger.debug();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createDebugLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });

  it('can create an error logger', () => {
    logger.error();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createErrorLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });

  it('can create an info logger', () => {
    logger.info();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createInfoLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });

  it('can create a trace logger', () => {
    logger.trace();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createTraceLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });

  it('can create a warning logger', () => {
    logger.warning();

    expect(lumberjackLogSpy).toHaveBeenCalledTimes(1);
    expect(lumberjackLogSpy).toHaveBeenCalledWith(
      createWarningLogBuilder(getUnixEpochTicks)('').withScope(logger.scope).build()
    );
  });
});
