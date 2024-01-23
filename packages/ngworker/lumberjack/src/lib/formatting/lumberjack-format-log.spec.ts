import { TestBed } from '@angular/core/testing';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackLogBuilder } from '../logging/lumberjack-log.builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LogLevel, LumberjackLogLevel } from '../logs/lumberjack-log-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
    });

    logFactory = TestBed.inject(LumberjackLogFactory);
  });

  let logFactory: LumberjackLogFactory;

  describe('Log level', () => {
    const logLevels: (LumberjackLogLevel | LogLevel)[] = [
      LumberjackLevel.Critical,
      LumberjackLevel.Debug,
      LumberjackLevel.Error,
      LumberjackLevel.Info,
      LumberjackLevel.Trace,
      LumberjackLevel.Warning,
      'critical',
      'debug',
      'error',
      'info',
      'trace',
      'warn',
    ];

    logLevels.forEach((expectedLevel) => {
      it(`prefixes the message with log level "${expectedLevel}"`, () => {
        const log = new LumberjackLogBuilder(TestBed.inject(LumberjackTimeService), expectedLevel, 'Log level test')
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
        const log = logFactory.createDebugLog('').withScope(expectedScope).build();

        const formattedLog = lumberjackFormatLog(log);

        const { scope: actualScope, taggedScope } = parseFormattedLog(formattedLog);
        expect(actualScope).toBe(expectedScope);
        expect(taggedScope).toBe(`[${expectedScope}]`);
      });
    });

    it('does not add a tag without a scope', () => {
      const log = logFactory.createDebugLog('Scope test').build();

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
        const log = logFactory.createDebugLog(expectedMessage).withScope('Message').build();

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });

      it(`places the message at the end without a scope`, () => {
        const log = logFactory.createDebugLog(expectedMessage).build();

        const formattedLog = lumberjackFormatLog(log);

        const { message: actualMessage } = parseFormattedLog(formattedLog);
        expect(actualMessage).toBe(expectedMessage);
      });
    });
  });
});
