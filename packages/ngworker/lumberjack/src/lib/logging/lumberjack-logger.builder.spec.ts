import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/test-util';

import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';
import { provideLumberjack } from '../configuration/provide-lumberjack';

import { LumberjackLogBuilder } from './lumberjack-log.builder';
import { LumberjackLoggerBuilder } from './lumberjack-logger.builder';
import { LumberjackService } from './lumberjack.service';

interface TestPayload extends LumberjackLogPayload {
  testProperty: string;
}

const lumberjackLogLevels: LumberjackLogLevel[] = ['critical', 'error'];

describe(LumberjackLoggerBuilder.name, () => {
  const testMessage = 'Test Message';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), { provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
    lumberjackService = TestBed.inject(LumberjackService) as LumberjackService;
    lumberjackLogSpy = jest.spyOn(lumberjackService, 'log').mockImplementation(() => {
      /* do nothing */
    });
  });

  let fakeTime: FakeTimeService;
  let lumberjackService: LumberjackService;
  let lumberjackLogSpy: jest.SpyInstance<void, [LumberjackLog<void>]>;

  describe('Base builder usage', () => {
    lumberjackLogLevels.forEach((level) =>
      it(`sends a ${level} level log`, () => {
        const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
        const logFunction = builder.build();
        logFunction();
        const expectedLog = new LumberjackLogBuilder(TestBed.inject(LumberjackTimeService), level, testMessage).build();

        expect(lumberjackLogSpy).toHaveBeenCalledWith(expectedLog);
      })
    );
  });

  it('logs the specified scope', () => {
    const level = 'critical';
    const scope = 'Test Scope';
    const builder = new LumberjackLoggerBuilder(lumberjackService, fakeTime, level, testMessage);
    const logFunction = builder.withScope(scope).build();
    logFunction();
    const expectedLog = new LumberjackLogBuilder(TestBed.inject(LumberjackTimeService), level, testMessage)
      .withScope(scope)
      .build();

    expect(lumberjackLogSpy).toHaveBeenCalledWith(expectedLog);
  });

  describe('LumberjackLogPayload', () => {
    const level = 'critical';
    const scope = 'Test Scope';
    const payload: TestPayload = {
      testProperty: 'TEST_PROPERTY',
    };
    let builder: LumberjackLoggerBuilder<TestPayload>;
    beforeEach(() => {
      builder = new LumberjackLoggerBuilder<TestPayload>(
        lumberjackService as unknown as LumberjackService<TestPayload>,
        fakeTime,
        level,
        testMessage
      );
    });

    it('logs the specified payload', () => {
      const logFunction = builder.withScope(scope).build();
      logFunction(payload);
      const expectedLog = new LumberjackLogBuilder<TestPayload>(
        TestBed.inject(LumberjackTimeService),
        level,
        testMessage
      )
        .withScope(scope)
        .withPayload(payload)
        .build();

      expect(lumberjackLogSpy).toHaveBeenCalledWith(expectedLog);
    });

    it('logs the specified static payload', () => {
      const logFunction = builder.withPayload(payload).build();
      logFunction();
      const expectedLog = new LumberjackLogBuilder<TestPayload>(
        TestBed.inject(LumberjackTimeService),
        level,
        testMessage
      )
        .withPayload(payload)
        .build();

      expect(lumberjackLogSpy).toHaveBeenCalledWith(expectedLog);
    });

    it('logs the specified scope and payload', () => {
      const logFunction = builder.withScope(scope).withPayload(payload).build();
      logFunction();
      const expectedLog = new LumberjackLogBuilder<TestPayload>(
        TestBed.inject(LumberjackTimeService),
        level,
        testMessage
      )
        .withScope(scope)
        .withPayload(payload)
        .build();

      expect(lumberjackLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });
});
