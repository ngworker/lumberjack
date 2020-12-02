import { TestBed } from '@angular/core/testing';

import { SpyConsole, SpyConsoleModule } from '@internal/console-driver/test-util';
import {
  createCriticalLog,
  createDebugLog,
  createErrorLog,
  createInfoLog,
  createTraceLog,
  createWarningLog,
  resolveDependency,
} from '@internal/test-util';
import { LogDriver, logDriverToken, LumberjackLogLevel } from '@ngworker/lumberjack';

import { ConsoleDriverModule } from './console-driver.module';
import { ConsoleDriver } from './console.driver';
import { lumberjackConsoleToken } from './lumberjack-console.token';

describe(ConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsoleDriverModule.forRoot({ levels: [LumberjackLogLevel.Verbose] }), SpyConsoleModule],
    });

    const [_driver] = (resolveDependency(logDriverToken) as unknown) as LogDriver[];
    driver = _driver as ConsoleDriver;
    spyLogger = resolveDependency(lumberjackConsoleToken) as SpyConsole;
  });

  let driver: ConsoleDriver;
  let spyLogger: SpyConsole;

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLogLevel.Critical;

    driver.logCritical({ formattedLog: expectedMessage, log: createCriticalLog(expectedMessage) });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLogLevel.Debug;

    driver.logDebug({ formattedLog: expectedMessage, log: createDebugLog(expectedMessage) });

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLogLevel.Error;

    driver.logError({ formattedLog: expectedMessage, log: createErrorLog(expectedMessage) });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLogLevel.Info;

    driver.logInfo({ formattedLog: expectedMessage, log: createInfoLog(expectedMessage) });

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLogLevel.Trace;

    driver.logTrace({ formattedLog: expectedMessage, log: createTraceLog(expectedMessage) });

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLogLevel.Warning;

    driver.logWarning({ formattedLog: expectedMessage, log: createWarningLog(expectedMessage) });

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage);
  });
});
