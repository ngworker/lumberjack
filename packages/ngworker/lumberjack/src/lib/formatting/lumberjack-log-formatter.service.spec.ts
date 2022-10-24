import { TestBed } from '@angular/core/testing';

import { FakeTimeService, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackOptions } from '../configuration/lumberjack.options';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFormatter } from './lumberjack-log-formatter.service';

function createFormattingErrorLog(formattingErrorMessage: string, log: LumberjackLog): LumberjackLog {
  const logFactory = resolveDependency(LumberjackLogFactory);

  return logFactory
    .createErrorLog(`Could not format message "${log.message}". Error: "${formattingErrorMessage}"`)
    .withScope(logFormattingErrorScope)
    .build();
}

const logFormattingErrorScope = 'LumberjackLogFormattingError';

describe(LumberjackLogFormatter.name, () => {
  function setup(options?: LumberjackOptions) {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(options)],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    const service = resolveDependency(LumberjackLogFormatter);
    const fakeTime = resolveDependency(LumberjackTimeService) as FakeTimeService;
    const logFactory = resolveDependency(LumberjackLogFactory);

    return {
      fakeTime,
      logFactory,
      service,
    };
  }

  describe('Log', () => {
    it('returns the same log when formatting succeeds', () => {
      const { logFactory, service } = setup();
      const expectedLog = logFactory.createErrorLog('').build();

      const { log: actualLog } = service.formatLog(expectedLog);

      expect(actualLog).toBe(expectedLog);
    });

    it('returns an error log when formatting fails', () => {
      const formatterErrorMessage = 'TestFormatter';
      const { logFactory, service } = setup({
        format: () => {
          throw new Error(formatterErrorMessage);
        },
      });
      const debugLog = logFactory.createDebugLog('Test debug message').build();
      const expectedLog = createFormattingErrorLog(formatterErrorMessage, debugLog);

      const { log: actualLog } = service.formatLog(debugLog);

      expect(actualLog).toEqual(expectedLog);
    });
  });

  describe('Formatted message', () => {
    it('returns the formatted log when formatting succeeds', () => {
      const { logFactory, service } = setup({
        format: ({ level }) => level,
      });
      const warning = logFactory.createWarningLog('').build();

      const { formattedLog: actualFormattedLog } = service.formatLog(warning);

      expect(actualFormattedLog).toBe(LumberjackLevel.Warning);
    });

    describe('Error message', () => {
      it('returns a format error when formatting fails because of an Error', () => {
        const formatterErrorMessage = 'TestFormatter';
        const { fakeTime, logFactory, service } = setup({
          format: () => {
            throw new Error(formatterErrorMessage);
          },
        });
        const nowTimestamp = '2020-07-07T00:00:00.000Z';
        fakeTime.setTime(new Date(nowTimestamp));

        const criticalLog = logFactory.createCriticalLog('Critical test').build();
        const formattingErrorLog = createFormattingErrorLog(formatterErrorMessage, criticalLog);

        const { formattedLog: actualFormattedLog } = service.formatLog(criticalLog);

        expect(actualFormattedLog).toBe(
          `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
        );
      });

      it('returns a format error when formatting fails with a string error message', () => {
        const formatterErrorMessage = 'TestFormatter';
        const { fakeTime, logFactory, service } = setup({
          format: () => {
            throw formatterErrorMessage;
          },
        });
        const nowTimestamp = '2020-07-07T00:00:00.000Z';
        fakeTime.setTime(new Date(nowTimestamp));

        const criticalLog = logFactory.createCriticalLog('Critical test').build();
        const formattingErrorLog = createFormattingErrorLog(formatterErrorMessage, criticalLog);

        const { formattedLog: actualFormattedLog } = service.formatLog(criticalLog);

        expect(actualFormattedLog).toBe(
          `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
        );
      });
    });
  });
});
