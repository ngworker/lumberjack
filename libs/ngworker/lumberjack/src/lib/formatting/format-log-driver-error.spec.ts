import { TestBed } from '@angular/core/testing';

import { NoopDriver, NoopDriverModule, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLogBuilder } from '../logging/lumberjack-log.builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { formatLogDriverError } from './format-log-driver-error';
import { lumberjackFormatLog } from './lumberjack-format-log';

describe(formatLogDriverError.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
    });
    time = resolveDependency(LumberjackTimeService);
    const [_logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
    logDriver = _logDriver;
  });

  const errorMessage = 'Test error message';
  let logDriver: NoopDriver;
  let time: LumberjackTimeService;

  describe('Error message', () => {
    beforeEach(() => {
      log = new LumberjackLogBuilder(time, LumberjackLevel.Info, 'Test info').build();
    });

    let log: LumberjackLog;

    it('includes the message of an Error', () => {
      const logDriverError: LumberjackLogDriverError = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        logDriver,
      };
      const formattedError = formatLogDriverError(logDriverError);

      expect(formattedError).toContain(errorMessage);
    });

    it('includes a string message', () => {
      const logDriverError: LumberjackLogDriverError = {
        error: errorMessage,
        formattedLog: lumberjackFormatLog(log),
        log,
        logDriver,
      };

      const formattedError = formatLogDriverError(logDriverError);

      expect(formattedError).toContain(errorMessage);
    });
  });

  describe('Payload', () => {
    interface TestPayload extends LumberjackLogPayload {
      readonly test: boolean;
    }

    it('includes the payload when the log has a payload', () => {
      const payload: TestPayload = {
        test: true,
      };
      const log = new LumberjackLogBuilder<TestPayload>(time, LumberjackLevel.Info, 'Test info')
        .withPayload(payload)
        .build();
      const logDriverError: LumberjackLogDriverError<TestPayload> = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        logDriver: logDriver as LumberjackLogDriver<TestPayload>,
      };

      const formattedError = formatLogDriverError(logDriverError);

      expect(formattedError).toContain(`with payload "${JSON.stringify(payload)}"`);
    });

    it('does not mention payload when the log has no payload', () => {
      const log = new LumberjackLogBuilder(time, LumberjackLevel.Info, 'Test info').build();
      const logDriverError: LumberjackLogDriverError = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        logDriver,
      };

      const formattedError = formatLogDriverError(logDriverError);

      expect(formattedError).not.toContain('with payload');
    });
  });
});
