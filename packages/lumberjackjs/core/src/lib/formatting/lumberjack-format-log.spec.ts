import { createFakeTime } from '@internal/core/test-util';

import { createDebugLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-debug-log-builder';
import { LumberjackLogBuilder } from '../logging/lumberjack-log.builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';

import { lumberjackFormatLog } from './lumberjack-format-log';

function parseFormattedLog(formattedLog: string) {
  const formattedLogPattern = /^([a-z]+) ([0-9.:\-TZ]+) (\[(.+)\] )?(.*)$/;

  const [, level, timestamp, taggedScopeWithEndingSpace = '', scope = '', message] =
    formattedLogPattern.exec(formattedLog) ?? [];
  const taggedScope = taggedScopeWithEndingSpace ? taggedScopeWithEndingSpace.slice(0, -1) : '';

  return {
    scope,
    level,
    message,
    taggedScope,
    timestamp,
  };
}

describe(lumberjackFormatLog.name, () => {
  const fakeTime = createFakeTime();

  const getUnixEpochTicks = fakeTime.getUnixEpochTicks;

  describe('Log level', () => {
    const logLevels: LumberjackLogLevel[] = [
      LumberjackLevel.Critical,
      LumberjackLevel.Debug,
      LumberjackLevel.Error,
      LumberjackLevel.Info,
      LumberjackLevel.Trace,
      LumberjackLevel.Warning,
    ];

    logLevels.forEach((expectedLevel) => {
      it(`prefixes the message with log level "${expectedLevel}"`, () => {
        const log = new LumberjackLogBuilder(expectedLevel, 'Log level test', fakeTime.getUnixEpochTicks)
          .withScope('Log level')
          .build();

        const formattedLog = lumberjackFormatLog(log);

        const { level: actualLevel } = parseFormattedLog(formattedLog);
        expect(actualLevel).toBe(expectedLevel);
      });
    });
  });

  describe('Timestamp', () => {
    const dateTimeToUtcTimestampRecord: [number, string][] = [
      ['2020-01-02T00:00:00+03:00', '2020-01-01T21:00:00.000Z'],
      ['2020-07-06T23:00:00-05:00', '2020-07-07T04:00:00.000Z'],
      ['2020-02-28T22:00:00-02:30', '2020-02-29T00:30:00.000Z'],
    ].map(([dateTime, utcTimestamp]) => [new Date(dateTime).valueOf(), utcTimestamp]);

    dateTimeToUtcTimestampRecord.forEach(([unixEpochTicks, expectedTimestamp]) => {
      it('adds the 0 hours UTC offset with milliseconds resolution', () => {
        const log: LumberjackLog = {
          createdAt: unixEpochTicks,
          level: LumberjackLevel.Debug,
          message: 'Timestamp test',
          scope: 'Timestamp',
        };

        const formattedLog = lumberjackFormatLog(log);

        const { timestamp: actualTimestamp } = parseFormattedLog(formattedLog);
        expect(actualTimestamp).toBe(expectedTimestamp);
      });
    });
  });

  describe('Scope', () => {
    const scopes = ['Test Scope', 'TestScope', 'test.scope'];

    scopes.forEach((expectedScope) => {
      it('tags the specified scope', () => {
        const log = createDebugLogBuilder(getUnixEpochTicks)('').withScope(expectedScope).build();

        const formattedLog = lumberjackFormatLog(log);

        const { scope: actualScope, taggedScope } = parseFormattedLog(formattedLog);
        expect(actualScope).toBe(expectedScope);
        expect(taggedScope).toBe(`[${expectedScope}]`);
      });
    });

    it('does not add a tag without a scope', () => {
      const log = createDebugLogBuilder(getUnixEpochTicks)('Scope test').build();

      const formattedLog = lumberjackFormatLog(log);

      const { scope: actualScope, taggedScope } = parseFormattedLog(formattedLog);
      expect(actualScope).toBe('');
      expect(taggedScope).toBe('');
    });
  });

  describe('Message', () => {
    const messages = ['The forest is on fire!', 'Lumber is gold', 'Saving the Amazon Jungle'];

    messages.forEach((expectedMessage) => {
      it(`places the message at the end with a scope`, () => {
        const log = createDebugLogBuilder(getUnixEpochTicks)(expectedMessage).withScope('Message').build();

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });

      it(`places the message at the end without a scope`, () => {
        const log = createDebugLogBuilder(getUnixEpochTicks)(expectedMessage).build();

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });
    });
  });
});
