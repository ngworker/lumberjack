import { TestBed } from '@angular/core/testing';

import { FakeTimeService } from '@internal/test-util';
import { resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackOptions } from '../configuration/lumberjack.options';
import { LumberjackLogBuilder } from '../logging/lumberjack-log.builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFormatter } from './lumberjack-log-formatter.service';

function createFormattingErrorLog(formattingErrorMessage: string, log: LumberjackLog): LumberjackLog {
  return new LumberjackLogBuilder(
    resolveDependency(LumberjackTimeService),
    LumberjackLevel.Error,
    `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`
  )
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

    return {
      fakeTime,
      service,
    };
  }

  describe('Log', () => {
    it('returns the same log when formatting succeeds', () => {
      const { service } = setup();
      const expectedLog = new LumberjackLogBuilder(
        resolveDependency(LumberjackTimeService),
        LumberjackLevel.Error,
        ''
      ).build();

      const { log: actualLog } = service.formatLog(expectedLog);

      expect(actualLog).toBe(expectedLog);
    });

    it('returns an error log when formatting fails', () => {
      const formatterErrorMessage = 'TestFormatter';
      const { service } = setup({
        format: () => {
          throw new Error(formatterErrorMessage);
        },
      });
      const debugLog = new LumberjackLogBuilder(
        resolveDependency(LumberjackTimeService),
        LumberjackLevel.Debug,
        'Test debug message'
      ).build();
      const expectedLog = createFormattingErrorLog(formatterErrorMessage, debugLog);

      const { log: actualLog } = service.formatLog(debugLog);

      expect(actualLog).toEqual(expectedLog);
    });
  });

  describe('Formatted message', () => {
    it('returns the formatted log when formatting succeeds', () => {
      const { service } = setup({
        format: ({ level }) => level,
      });
      const warning = new LumberjackLogBuilder(
        resolveDependency(LumberjackTimeService),
        LumberjackLevel.Warning,
        ''
      ).build();

      const { formattedLog: actualFormattedLog } = service.formatLog(warning);

      expect(actualFormattedLog).toBe(LumberjackLevel.Warning);
    });

    it('returns a format error when formatting fails', () => {
      const formatterErrorMessage = 'TestFormatter';
      const { fakeTime, service } = setup({
        format: () => {
          throw new Error(formatterErrorMessage);
        },
      });
      const nowTimestamp = '2020-07-07T00:00:00.000Z';
      fakeTime.setTime(new Date(nowTimestamp));

      const criticalLog = new LumberjackLogBuilder(
        resolveDependency(LumberjackTimeService),
        LumberjackLevel.Warning,
        'Critical test'
      ).build();
      const formattingErrorLog = createFormattingErrorLog(formatterErrorMessage, criticalLog);

      const { formattedLog: actualFormattedLog } = service.formatLog(criticalLog);

      expect(actualFormattedLog).toBe(
        `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
      );
    });
  });
});
