import { TestBed } from '@angular/core/testing';

import { SpyConsole, SpyConsoleModule } from '@internal/console-driver/test-util';
import { resolveDependency } from '@internal/test-util';
import { LumberjackLevel, LumberjackLogDriver, lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriverModule } from '../configuration/lumberjack-console-driver.module';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

import { LumberjackConsoleDriver } from './lumberjack-console.driver';

describe(LumberjackConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackConsoleDriverModule.forRoot({ levels: [LumberjackLevel.Verbose] }), SpyConsoleModule],
    });

    const [_driver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
    driver = _driver as LumberjackConsoleDriver;
    spyLogger = resolveDependency(lumberjackConsoleToken) as SpyConsole;
  });

  let driver: LumberjackConsoleDriver;
  let spyLogger: SpyConsole;

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Critical;

    driver.logCritical(expectedMessage);

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLevel.Debug;

    driver.logDebug(expectedMessage);

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Error;

    driver.logError(expectedMessage);

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLevel.Info;

    driver.logInfo(expectedMessage);

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLevel.Trace;

    driver.logTrace(expectedMessage);

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLevel.Warning;

    driver.logWarning(expectedMessage);

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage);
  });
});
