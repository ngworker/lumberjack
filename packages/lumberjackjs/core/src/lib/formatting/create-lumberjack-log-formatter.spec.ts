import { createFakeTime } from '@internal/core/test-util';

import { createLumberjackConfig } from '../configuration/create-lumberjack-config';
import { LumberjackOptions } from '../configuration/lumberjack.options';
import { createCriticalLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-critical-log-builder';
import { createDebugLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-debug-log-builder';
import { createErrorLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-error-log-builder';
import { createWarningLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-warning-log-builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';

import { createLumberjackLogFormatter } from './create-lumberjack-log-formatter';

function createFormattingErrorLog(
  formattingErrorMessage: string,
  log: LumberjackLog,
  getUnixEpochTicks: () => number
): LumberjackLog {
  return createErrorLogBuilder(getUnixEpochTicks)(
    `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`
  )
    .withScope(logFormattingErrorScope)
    .build();
}

const logFormattingErrorScope = 'LumberjackLogFormattingError';

describe(createLumberjackLogFormatter.name, () => {
  function setup(options?: LumberjackOptions) {
    const fakeTime = createFakeTime();
    const formatLog = createLumberjackLogFormatter({
      getUnixEpochTicks: fakeTime.getUnixEpochTicks,
      config: createLumberjackConfig(false, options),
    });

    return {
      fakeTime,
      formatLog,
    };
  }

  describe('Log', () => {
    it('returns the same log when formatting succeeds', () => {
      const { formatLog, fakeTime } = setup();
      const expectedLog = createErrorLogBuilder(fakeTime.getUnixEpochTicks)('').build();

      const { log: actualLog } = formatLog(expectedLog);

      expect(actualLog).toBe(expectedLog);
    });

    it('returns an error log when formatting fails', () => {
      const formatterErrorMessage = 'TestFormatter';
      const { formatLog, fakeTime } = setup({
        format: () => {
          throw new Error(formatterErrorMessage);
        },
      });
      const debugLog = createDebugLogBuilder(fakeTime.getUnixEpochTicks)('Test debug message').build();
      const expectedLog = createFormattingErrorLog(formatterErrorMessage, debugLog, fakeTime.getUnixEpochTicks);

      const { log: actualLog } = formatLog(debugLog);

      expect(actualLog).toEqual(expectedLog);
    });
  });

  describe('Formatted message', () => {
    it('returns the formatted log when formatting succeeds', () => {
      const { fakeTime, formatLog } = setup({
        format: ({ level }) => level,
      });
      const warning = createWarningLogBuilder(fakeTime.getUnixEpochTicks)('').build();

      const { formattedLog: actualFormattedLog } = formatLog(warning);

      expect(actualFormattedLog).toBe(LumberjackLevel.Warning);
    });

    describe('Error message', () => {
      it('returns a format error when formatting fails because of an Error', () => {
        const formatterErrorMessage = 'TestFormatter';
        const { fakeTime, formatLog } = setup({
          format: () => {
            throw new Error(formatterErrorMessage);
          },
        });
        const nowTimestamp = '2020-07-07T00:00:00.000Z';
        fakeTime.setTime(new Date(nowTimestamp));

        const criticalLog = createCriticalLogBuilder(fakeTime.getUnixEpochTicks)('Critical test').build();
        const formattingErrorLog = createFormattingErrorLog(
          formatterErrorMessage,
          criticalLog,
          fakeTime.getUnixEpochTicks
        );

        const { formattedLog: actualFormattedLog } = formatLog(criticalLog);

        expect(actualFormattedLog).toBe(
          `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
        );
      });

      it('returns a format error when formatting fails with a string error message', () => {
        const formatterErrorMessage = 'TestFormatter';
        const { fakeTime, formatLog } = setup({
          format: () => {
            throw formatterErrorMessage;
          },
        });
        const nowTimestamp = '2020-07-07T00:00:00.000Z';
        fakeTime.setTime(new Date(nowTimestamp));

        const criticalLog = createCriticalLogBuilder(fakeTime.getUnixEpochTicks)('Critical test').build();
        const formattingErrorLog = createFormattingErrorLog(
          formatterErrorMessage,
          criticalLog,
          fakeTime.getUnixEpochTicks
        );

        const { formattedLog: actualFormattedLog } = formatLog(criticalLog);

        expect(actualFormattedLog).toBe(
          `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
        );
      });
    });
  });
});
