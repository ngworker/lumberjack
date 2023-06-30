import { LumberjackLevel, LumberjackLog, LumberjackLogLevel, LumberjackLogPayload } from '@webworker/lumberjack';
import { createFakeTime } from '@internal/core/test-util';

import { LumberjackLogBuilder } from './lumberjack-log.builder';

interface TestPayload extends LumberjackLogPayload {
  testProperty: string;
}

const lumberjackLogLevels: LumberjackLogLevel[] = [LumberjackLevel.Critical, LumberjackLevel.Error];

describe(LumberjackLogBuilder.name, () => {
  const testMessage = 'Test Message';

  const fakeTime = createFakeTime();

  describe('Base builder usage', () => {
    lumberjackLogLevels.forEach((level) =>
      it(`creates a LumberjackLog with a ${level} level log`, () => {
        const builder = new LumberjackLogBuilder(level, testMessage, fakeTime.getUnixEpochTicks);
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
    const actualLog = new LumberjackLogBuilder(level, testMessage, fakeTime.getUnixEpochTicks).withScope(scope).build();

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
      builder = new LumberjackLogBuilder<TestPayload>(level, testMessage, fakeTime.getUnixEpochTicks);
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
