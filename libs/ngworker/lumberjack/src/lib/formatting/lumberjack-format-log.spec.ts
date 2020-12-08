import { createDebugLog } from '@internal/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';

import { lumberjackFormatLog } from './lumberjack-format-log';

function parseFormattedLog(formattedLog: string) {
  const formattedLogPattern = /^([a-z]+) ([0-9\.:\-TZ]+) (\[(.+)\] )?(.*)$/;
  const [_, level, timestamp, taggedContextWithEndingSpace = '', scope = '', message] =
    formattedLogPattern.exec(formattedLog) || [];
  const taggedContext = taggedContextWithEndingSpace ? taggedContextWithEndingSpace.slice(0, -1) : '';

  return {
    scope,
    level,
    message,
    taggedContext,
    timestamp,
  };
}

describe(lumberjackFormatLog.name, () => {
  describe('Log level', () => {
    const logLevels: ReadonlyArray<LumberjackLogLevel> = [
      LumberjackLevel.Critical,
      LumberjackLevel.Debug,
      LumberjackLevel.Error,
      LumberjackLevel.Info,
      LumberjackLevel.Trace,
      LumberjackLevel.Warning,
    ];

    logLevels.forEach((expectedLevel) => {
      it(`prefixes the message with log level "${expectedLevel}"`, () => {
        const log: LumberjackLog = {
          createdAt: new Date().valueOf(),
          level: expectedLevel,
          message: 'Test message',
          scope: 'Test scope',
        };

        const formattedLog = lumberjackFormatLog(log);

        const { level: actualLevel } = parseFormattedLog(formattedLog);
        expect(actualLevel).toBe(expectedLevel);
      });
    });
  });

  describe('Timestamp', () => {
    const dateTimeToUtcTimestampRecord: ReadonlyArray<[number, string]> = [
      ['2020-01-02T00:00:00+03:00', '2020-01-01T21:00:00.000Z'],
      ['2020-07-06T23:00:00-05:00', '2020-07-07T04:00:00.000Z'],
      ['2020-02-28T22:00:00-02:30', '2020-02-29T00:30:00.000Z'],
    ].map(([dateTime, utcTimestamp]) => [new Date(dateTime).valueOf(), utcTimestamp]);

    dateTimeToUtcTimestampRecord.forEach(([unixEpochTicks, expectedTimestamp]) => {
      it('adds the 0 hours UTC offset with milliseconds resolution', () => {
        const log: LumberjackLog = {
          createdAt: unixEpochTicks,
          level: LumberjackLevel.Debug,
          message: 'Test message',
          scope: 'Test scope',
        };

        const formattedLog = lumberjackFormatLog(log);

        const { timestamp: actualTimestamp } = parseFormattedLog(formattedLog);
        expect(actualTimestamp).toBe(expectedTimestamp);
      });
    });
  });

  describe('Scope', () => {
    const scopes = ['Test scope', 'TestContext', 'test.scope'];

    scopes.forEach((expectedContext) => {
      it('tags the specified scope', () => {
        const log = createDebugLog(undefined, expectedContext);

        const formattedLog = lumberjackFormatLog(log);

        const { scope: actualContext, taggedContext } = parseFormattedLog(formattedLog);
        expect(actualContext).toBe(expectedContext);
        expect(taggedContext).toBe(`[${expectedContext}]`);
      });
    });

    it('does not add a tag without a scope', () => {
      const log = createDebugLog('Test message', '');

      const formattedLog = lumberjackFormatLog(log);

      const { scope: actualContext, taggedContext } = parseFormattedLog(formattedLog);
      expect(actualContext).toBe('');
      expect(taggedContext).toBe('');
    });
  });

  describe('Message', () => {
    const messages = ['The forest is on fire!', 'Lumber is gold', 'Saving the Amazon Jungle'];

    messages.forEach((expectedMessage) => {
      it(`places the message at the end with a scope`, () => {
        const log = createDebugLog(expectedMessage, 'Test scope');

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });

      it(`places the message at the end without a scope`, () => {
        const log = createDebugLog(expectedMessage, '');

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });
    });
  });
});
