import { TestBed } from '@angular/core/testing';

import { SpyConsoleLogger, SpyConsoleLoggerModule } from '@internal/console-driver/test-util';
import { resolveDependency } from '@internal/test-util';
import { LogDriver, LogDriverToken, LumberjackLogLevel } from '@ngworker/lumberjack';

import { ConsoleDriverModule } from './console-driver.module';
import { ConsoleLoggerToken } from './console-logger.token';
import { ConsoleDriver } from './console.driver';

describe(ConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsoleDriverModule.forRoot({ levels: [LumberjackLogLevel.Verbose] }), SpyConsoleLoggerModule],
    });

    const [_driver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];
    driver = _driver as ConsoleDriver;
    spyLogger = resolveDependency(ConsoleLoggerToken) as SpyConsoleLogger;
  });

  let driver: ConsoleDriver;
  let spyLogger: SpyConsoleLogger;

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLogLevel.Critical;

    driver.logCritical(expectedMessage);

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLogLevel.Debug;

    driver.logDebug(expectedMessage);

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLogLevel.Error;

    driver.logError(expectedMessage);

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLogLevel.Info;

    driver.logInfo(expectedMessage);

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLogLevel.Trace;

    driver.logTrace(expectedMessage);

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLogLevel.Warning;

    driver.logWarning(expectedMessage);

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage);
  });
});
