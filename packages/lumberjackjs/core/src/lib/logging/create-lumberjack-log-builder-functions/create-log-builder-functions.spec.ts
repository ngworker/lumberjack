import { createFakeTime } from '@internal/core/test-util';

import { LumberjackLevel } from '../../logs/lumberjack-level';
import { LumberjackLogPayload } from '../../logs/lumberjack-log-payload';
import { LumberjackLogBuilder } from '../lumberjack-log.builder';

import { createCriticalLogBuilder } from './create-critical-log-builder';
import { createDebugLogBuilder } from './create-debug-log-builder';
import { createErrorLogBuilder } from './create-error-log-builder';
import { createInfoLogBuilder } from './create-info-log-builder';
import { createTraceLogBuilder } from './create-trace-log-builder';
import { createWarningLogBuilder } from './create-warning-log-builder';

describe('createLogBuilderFunctions', () => {
  const fakeTime = createFakeTime();

  const testMessage = 'Test message';
  const getUnixEpochTicks = fakeTime.getUnixEpochTicks;

  describe('Log levels', () => {
    it('creates a critical log', () => {
      const log = createCriticalLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creates a debug log', () => {
      const log = createDebugLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creates a error log', () => {
      const log = createErrorLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creates a info log', () => {
      const log = createInfoLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creates a trace log', () => {
      const log = createTraceLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creates a warning log', () => {
      const log = createWarningLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });

  describe('Scope', () => {
    it('creates a log with a scope', () => {
      const testScope = 'Test scope';
      const log = createCriticalLogBuilder(getUnixEpochTicks)(testMessage).withScope(testScope).build();

      expect(log.scope).toBe(testScope);
    });

    it('creates a log without a scope', () => {
      const log = createDebugLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.scope).toBeUndefined();
    });
  });

  describe('Payload', () => {
    interface TestPayload extends LumberjackLogPayload {
      readonly test: boolean;
    }

    it('creates a log with a static payload', () => {
      const log = createErrorLogBuilder<TestPayload>(getUnixEpochTicks)(testMessage)
        .withPayload({ test: true })
        .build();

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log with a dynamic payload', () => {
      const log = createInfoLogBuilder<TestPayload>(getUnixEpochTicks)(testMessage).build({ test: true });

      expect(log.payload?.test).toBeTruthy();
    });

    it('creates a log without a payload', () => {
      const log = createTraceLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.payload).toBeUndefined();
    });
  });

  describe('Created at timestamp', () => {
    beforeEach(() => {
      fakeTime.setTime(fakeNow);
    });

    const fakeNow = new Date('2021-01-21T21:21:21Z');

    it('timestamps the log with the current date and time', () => {
      const log = createTraceLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(new Date(log.createdAt)).toEqual(fakeNow);
    });

    it('timestamps the log with the current date and time', () => {
      const firstLog = createWarningLogBuilder(getUnixEpochTicks)(testMessage).build();
      const fakeLater = new Date('2021-01-23T23:23:23Z');
      fakeTime.setTime(fakeLater);

      const secondLog = createCriticalLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(new Date(firstLog.createdAt)).toEqual(fakeNow);
      expect(new Date(secondLog.createdAt)).toEqual(fakeLater);
    });
  });

  describe('Log message', () => {
    it('creates a log with a message', () => {
      const log = createCriticalLogBuilder(getUnixEpochTicks)(testMessage).build();

      expect(log.message).toBe(testMessage);
    });

    it('creates a log with another message', () => {
      const otherMessage = 'Woodpecker';
      const log = createCriticalLogBuilder(getUnixEpochTicks)(otherMessage).build();

      expect(log.message).toBe(otherMessage);
    });
  });

  describe('Log builder factories', () => {
    it('creats a log builder with the critical log level', () => {
      const logBuilder = createCriticalLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Critical);
    });

    it('creats a log builder with the debug log level', () => {
      const logBuilder = createDebugLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Debug);
    });

    it('creats a log builder with the error log level', () => {
      const logBuilder = createErrorLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Error);
    });

    it('creats a log builder with the info log level', () => {
      const logBuilder = createInfoLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Info);
    });

    it('creats a log builder with the trace log level', () => {
      const logBuilder = createTraceLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Trace);
    });

    it('creats a log builder with the warning log level', () => {
      const logBuilder = createWarningLogBuilder(getUnixEpochTicks)(testMessage);
      const log = logBuilder.build();

      expect(logBuilder).toBeInstanceOf(LumberjackLogBuilder);
      expect(log.level).toBe(LumberjackLevel.Warning);
    });
  });
});
