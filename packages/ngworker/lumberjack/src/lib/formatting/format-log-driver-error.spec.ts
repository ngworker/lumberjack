import { TestBed } from '@angular/core/testing';
import {
  formatLogDriverError,
  lumberjackFormatLog,
  LumberjackLog,
  LumberjackLogDriver,
  LumberjackLogDriverError,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

import { NoopDriver, NoopDriverModule } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';

describe(formatLogDriverError.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
    });
    const [_logDriver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
    logDriver = _logDriver;
    logFactory = TestBed.inject(LumberjackLogFactory);
  });

  const errorMessage = 'Test error message';
  const testMessage = 'Test info';
  let logDriver: NoopDriver;
  let logFactory: LumberjackLogFactory;

  describe('Error message', () => {
    beforeEach(() => {
      log = logFactory.createInfoLog(testMessage).build();
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
      const logFactoryWithPayload = logFactory as unknown as LumberjackLogFactory<TestPayload>;
      const log = logFactoryWithPayload.createInfoLog(testMessage).withPayload(payload).build();
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
      const log = logFactory.createInfoLog(testMessage).build();
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
