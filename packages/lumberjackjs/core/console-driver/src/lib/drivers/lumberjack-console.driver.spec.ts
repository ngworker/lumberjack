import {
  createCriticalLogBuilder,
  createDebugLogBuilder,
  createErrorLogBuilder,
  createInfoLogBuilder,
  createTraceLogBuilder,
  createWarningLogBuilder,
  LumberjackLevel,
} from '@lumberjackjs/core';
import { createFakeTime, SpyConsole } from '@internal/core/test-util';

import { LumberjackConsoleDriver } from './lumberjack-console.driver';

describe(LumberjackConsoleDriver.name, () => {
  let spyLogger: SpyConsole;
  let consoleDriver: LumberjackConsoleDriver;
  const fakeTime = createFakeTime();

  beforeEach(() => {
    spyLogger = new SpyConsole();
    consoleDriver = new LumberjackConsoleDriver(
      {
        levels: [LumberjackLevel.Verbose],
        identifier: LumberjackConsoleDriver.driverIdentifier,
      },
      spyLogger
    );
  });

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Critical;
    const expectedLog = createCriticalLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logCritical({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLevel.Debug;
    const expectedLog = createDebugLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logDebug({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Error;
    const expectedLog = createErrorLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logError({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLevel.Info;
    const expectedLog = createInfoLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logInfo({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLevel.Trace;
    const expectedLog = createTraceLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logTrace({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLevel.Warning;
    const expectedLog = createWarningLogBuilder(fakeTime.getUnixEpochTicks)(expectedMessage).build();

    consoleDriver.logWarning({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage, undefined);
  });
});
