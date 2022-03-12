import { TestBed } from '@angular/core/testing';

import { NoopDriver, NoopDriverModule, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';

import { formatLogDriverError } from './format-log-driver-error';
import { lumberjackFormatLog } from './lumberjack-format-log';

describe(formatLogDriverError.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
    });
    const [_logDriver] = resolveDependency(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
    logDriver = _logDriver;
    logFactory = resolveDependency(LumberjackLogFactory);
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
