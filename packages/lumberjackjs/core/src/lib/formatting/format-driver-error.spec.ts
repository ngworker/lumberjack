import { createFakeTime, createSpyDriver } from '@internal/core/test-util';

import { LumberjackDriverError } from '../drivers/lumberjack-driver-error';
import { createLumberjackLogFactory } from '../logging/create-lumberjack-log-factory';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLogPayload } from '../logs/lumberjack-log-payload';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackDriver } from '../drivers/lumberjack-driver';
import { LumberjackLogFactory } from '../logging/lumberjack-log-factory';

import { formatDriverError } from './format-driver-error';
import { lumberjackFormatLog } from './lumberjack-format-log';

describe(formatDriverError.name, () => {
  const logFactory = createLumberjackLogFactory({ getUnixEpochTicks: createFakeTime().getUnixEpochTicks });
  const errorMessage = 'Test error message';
  const testMessage = 'Test info';
  const driver = createSpyDriver({ levels: [LumberjackLevel.Verbose] });

  describe('Error message', () => {
    beforeEach(() => {
      log = logFactory.createInfoLog(testMessage).build();
    });

    let log: LumberjackLog;

    it('includes the message of an Error', () => {
      const driverError: LumberjackDriverError = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        driver,
      };
      const formattedError = formatDriverError(driverError);

      expect(formattedError).toContain(errorMessage);
    });

    it('includes a string message', () => {
      const driverError: LumberjackDriverError = {
        error: errorMessage,
        formattedLog: lumberjackFormatLog(log),
        log,
        driver,
      };

      const formattedError = formatDriverError(driverError);

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
      const driverError: LumberjackDriverError<TestPayload> = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        driver: driver as LumberjackDriver<TestPayload>,
      };

      const formattedError = formatDriverError(driverError);

      expect(formattedError).toContain(`with payload "${JSON.stringify(payload)}"`);
    });

    it('does not mention payload when the log has no payload', () => {
      const log = logFactory.createInfoLog(testMessage).build();
      const driverError: LumberjackDriverError = {
        error: new Error(errorMessage),
        formattedLog: lumberjackFormatLog(log),
        log,
        driver,
      };

      const formattedError = formatDriverError(driverError);

      expect(formattedError).not.toContain('with payload');
    });
  });
});
