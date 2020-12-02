import { TestBed } from '@angular/core/testing';

import {
  createCriticalLog,
  createDebugLog,
  createErrorLog,
  createWarningLog,
  resolveDependency,
} from '@internal/test-util';

import { LumberjackLogOptions } from '../configs';
import { LumberjackLog } from '../lumberjack-log';
import { LumberjackLogLevel } from '../lumberjack-log-levels';
import { LumberjackModule } from '../lumberjack.module';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { LumberjackFormatter } from './lumberjack-formatter.service';

function createFormatErrorLog(formatterErrorMessage: string, logEntry: LumberjackLog): LumberjackLog {
  return createErrorLog(
    `Could not format message "${logEntry.message}". Error: "${formatterErrorMessage}"`,
    'LumberjackFormatError'
  );
}

class FakeTimeService extends LumberjackTimeService {
  private now = new Date();

  getUnixEpochTicks() {
    return this.now.valueOf();
  }
  setTime(fakeNow: Date): void {
    this.now = fakeNow;
  }
}

describe(LumberjackFormatter.name, () => {
  function setup(options?: LumberjackLogOptions) {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(options)],
      providers: [{ provide: LumberjackTimeService, useClass: FakeTimeService }],
    });

    const service = resolveDependency(LumberjackFormatter);
    const fakeTime = resolveDependency(LumberjackTimeService) as FakeTimeService;

    return {
      fakeTime,
      service,
    };
  }

  describe('Log entry', () => {
    it('returns the same log entry when formatting succeeds', () => {
      const { service } = setup();
      const expectedLog = createErrorLog();

      const { log: actualLog } = service.formatLogEntry(expectedLog);

      expect(actualLog).toBe(expectedLog);
    });

    it('returns an error entry when formatting fails', () => {
      const formatterErrorMessage = 'TestFormatter';
      const { service } = setup({
        format: () => {
          throw new Error(formatterErrorMessage);
        },
      });
      const debugLog = createDebugLog('Test debug message');
      const expectedLog = createFormatErrorLog(formatterErrorMessage, debugLog);

      const { log: actualLog } = service.formatLogEntry(debugLog);

      expect(actualLog).toEqual(expectedLog);
    });
  });

  describe('Formatted message', () => {
    it('returns the formatted log entry message when formatting succeeds', () => {
      const { service } = setup({
        format: ({ level }) => level,
      });
      const warning = createWarningLog();

      const { formattedLog: actualMessage } = service.formatLogEntry(warning);

      expect(actualMessage).toBe(LumberjackLogLevel.Warning);
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
      const formatErrorLog = createFormatErrorLog(formatterErrorMessage, criticalLog);

      const { formattedLog: actualMessage } = service.formatLogEntry(criticalLog);

      expect(actualMessage).toBe(
        `${formatErrorLog.level} ${nowTimestamp} [LumberjackFormatError] ${formatErrorLog.message}`
      );
    });
  });
});
