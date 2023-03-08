import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogBuilder } from './lumberjack-log.builder';

interface TestPayload extends LumberjackLogPayload {
  testProperty: string;
}

const lumberjackLogLevels: LumberjackLogLevel[] = [LumberjackLevel.Critical, LumberjackLevel.Error];

describe(LumberjackLogBuilder.name, () => {
  const testMessage = 'Test Message';

  let fakeTime: FakeTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    fakeTime = TestBed.inject(LumberjackTimeService) as FakeTimeService;
  });

  describe('Base builder usage', () => {
    lumberjackLogLevels.forEach((level) =>
      it(`creates a LumberjackLog with a ${level} level log`, () => {
        const builder = new LumberjackLogBuilder(fakeTime, level, testMessage);
        const actualLog = builder.build();
        const expectedLog: LumberjackLog = {
          level,
          message: testMessage,
          createdAt: fakeTime.getUnixEpochTicks(),
          scope: undefined,
          payload: undefined,
        };

        expect(actualLog).toEqual(expectedLog);
      })
    );
  });

  it('creates a log with the specified scope', () => {
    const level = LumberjackLevel.Critical;
    const scope = 'Test Scope';
    const actualLog = new LumberjackLogBuilder(fakeTime, level, testMessage).withScope(scope).build();

    const expectedLog: LumberjackLog = {
      level,
      message: testMessage,
      createdAt: fakeTime.getUnixEpochTicks(),
      scope,
      payload: undefined,
    };

    expect(actualLog).toEqual(expectedLog);
  });

  describe('using Payload', () => {
    const level = LumberjackLevel.Critical;
    const scope = 'Test Scope';
    const payload: TestPayload = {
      testProperty: 'TEST_PROPERTY',
    };
    let builder: LumberjackLogBuilder<TestPayload>;
    beforeEach(() => {
      builder = new LumberjackLogBuilder<TestPayload>(fakeTime, level, testMessage);
    });

    it('logs the specified payload', () => {
      const actualLog = builder.build(payload);

      const expectedLog: LumberjackLog<TestPayload> = {
        level,
        message: testMessage,
        createdAt: fakeTime.getUnixEpochTicks(),
        scope: undefined,
        payload,
      };

      expect(actualLog).toEqual(expectedLog);
    });

    it('logs the specified payload with scope', () => {
      const actualLog = builder.withScope(scope).build(payload);

      const expectedLog: LumberjackLog<TestPayload> = {
        level,
        message: testMessage,
        createdAt: fakeTime.getUnixEpochTicks(),
        scope,
        payload,
      };

      expect(actualLog).toEqual(expectedLog);
    });

    it('logs the specified static payload', () => {
      const actualLog = builder.withPayload(payload).build();

      const expectedLog: LumberjackLog<TestPayload> = {
        level,
        message: testMessage,
        createdAt: fakeTime.getUnixEpochTicks(),
        scope: undefined,
        payload,
      };

      expect(actualLog).toEqual(expectedLog);
    });

    it('logs the specified scope and static payload', () => {
      const actualLog = builder.withScope(scope).withPayload(payload).build();
      const expectedLog: LumberjackLog<TestPayload> = {
        level,
        message: testMessage,
        createdAt: fakeTime.getUnixEpochTicks(),
        scope,
        payload,
      };

      expect(actualLog).toEqual(expectedLog);
    });
  });
});
