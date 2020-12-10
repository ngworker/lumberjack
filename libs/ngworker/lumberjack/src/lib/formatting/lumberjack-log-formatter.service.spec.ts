import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  createCriticalLog,
  createDebugLog,
  createErrorLog,
  createWarningLog,
  resolveDependency,
} from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackOptions } from '../configuration/lumberjack.options';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackLogFormatter } from './lumberjack-log-formatter.service';

function createFormattingErrorLog(formattingErrorMessage: string, log: LumberjackLog): LumberjackLog {
  return createErrorLog(
    `Could not format message "${log.message}". Error: "${formattingErrorMessage}"`,
    logFormattingErrorScope
  );
}

@Injectable()
class FakeTimeService extends LumberjackTimeService {
  private now = new Date();

  getUnixEpochTicks() {
    return this.now.valueOf();
  }
  setTime(fakeNow: Date): void {
    this.now = fakeNow;
  }
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
      const expectedLog = createErrorLog();

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
      const debugLog = createDebugLog('Test debug message');
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
      const warning = createWarningLog();

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
      const criticalLog = createCriticalLog('Critical test');
      const formattingErrorLog = createFormattingErrorLog(formatterErrorMessage, criticalLog);

      const { formattedLog: actualFormattedLog } = service.formatLog(criticalLog);

      expect(actualFormattedLog).toBe(
        `${formattingErrorLog.level} ${nowTimestamp} [${logFormattingErrorScope}] ${formattingErrorLog.message}`
      );
    });
  });
});
