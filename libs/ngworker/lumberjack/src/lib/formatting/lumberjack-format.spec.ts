import { createDebugLog } from '@internal/test-util';

import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';

import { lumberjackFormat } from './lumberjack-format';

function parseFormattedLog(formattedLog: string) {
  const formattedLogPattern = /^([a-z]+) ([0-9\.:\-TZ]+) (\[(.+)\] )?(.*)$/;
  const [_, level, timestamp, taggedContextWithEndingSpace = '', context = '', message] =
    formattedLogPattern.exec(formattedLog) || [];
  const taggedContext = taggedContextWithEndingSpace ? taggedContextWithEndingSpace.slice(0, -1) : '';

  return {
    context,
    level,
    message,
    taggedContext,
    timestamp,
  };
}

describe(lumberjackFormat.name, () => {
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
        const logEntry: LumberjackLog = {
          createdAt: new Date().valueOf(),
          level: expectedLevel,
          message: 'Test message',
          context: 'Test context',
        };

        const formattedLog = lumberjackFormat(logEntry);

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
        const logEntry: LumberjackLog = {
          createdAt: unixEpochTicks,
          level: LumberjackLevel.Debug,
          message: 'Test message',
          context: 'Test context',
        };

        const formattedLog = lumberjackFormat(logEntry);

        const { timestamp: actualTimestamp } = parseFormattedLog(formattedLog);
        expect(actualTimestamp).toBe(expectedTimestamp);
      });
    });
  });

  describe('Context', () => {
    const contexts = ['Test context', 'TestContext', 'test.context'];

    contexts.forEach((expectedContext) => {
      it('tags the specified context', () => {
        const logEntry = createDebugLog(undefined, expectedContext);

        const formattedLog = lumberjackFormat(logEntry);

        const { context: actualContext, taggedContext } = parseFormattedLog(formattedLog);
        expect(actualContext).toBe(expectedContext);
        expect(taggedContext).toBe(`[${expectedContext}]`);
      });
    });

    it('does not add a tag without a context', () => {
      const logEntry = createDebugLog('Test message', '');

      const formattedLog = lumberjackFormat(logEntry);

      const { context: actualContext, taggedContext } = parseFormattedLog(formattedLog);
      expect(actualContext).toBe('');
      expect(taggedContext).toBe('');
    });
  });

  describe('Message', () => {
    const messages = ['The forest is on fire!', 'Lumber is gold', 'Saving the Amazon Jungle'];

    messages.forEach((expectedMessage) => {
      it(`places the message at the end with a context`, () => {
        const logEntry = createDebugLog(expectedMessage, 'Test context');

        const formattedLog = lumberjackFormat(logEntry);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });

      it(`places the message at the end without a context`, () => {
        const logEntry = createDebugLog(expectedMessage, '');

        const formattedLog = lumberjackFormat(logEntry);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });
    });
  });
});
