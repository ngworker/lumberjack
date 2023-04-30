import { TestBed } from '@angular/core/testing';
import { LumberjackLevel, LumberjackLogDriver } from '@webworker/lumberjack';

import { SpyConsole, SpyConsoleModule } from '@internal/console-driver/test-util';
import { lumberjackLogDriverToken, LumberjackLogFactory, LumberjackModule } from '@ngworker/lumberjack';

import { LumberjackConsoleDriverModule } from '../configuration/lumberjack-console-driver.module';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

import { LumberjackConsoleDriver } from './lumberjack-console.driver';

describe(LumberjackConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LumberjackModule.forRoot(),
        LumberjackConsoleDriverModule.forRoot({
          levels: [LumberjackLevel.Verbose],
          identifier: LumberjackConsoleDriver.driverIdentifier,
        }),
        SpyConsoleModule,
      ],
    });

    const [_driver] = TestBed.inject(lumberjackLogDriverToken) as unknown as LumberjackLogDriver[];
    driver = _driver as LumberjackConsoleDriver;
    logFactory = TestBed.inject(LumberjackLogFactory);
    spyLogger = TestBed.inject(lumberjackConsoleToken) as SpyConsole;
  });

  let driver: LumberjackConsoleDriver;
  let logFactory: LumberjackLogFactory;
  let spyLogger: SpyConsole;

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Critical;
    const expectedLog = logFactory.createCriticalLog(expectedMessage).build();

    driver.logCritical({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLevel.Debug;
    const expectedLog = logFactory.createDebugLog(expectedMessage).build();

    driver.logDebug({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Error;
    const expectedLog = logFactory.createErrorLog(expectedMessage).build();

    driver.logError({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLevel.Info;
    const expectedLog = logFactory.createInfoLog(expectedMessage).build();

    driver.logInfo({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLevel.Trace;
    const expectedLog = logFactory.createTraceLog(expectedMessage).build();

    driver.logTrace({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLevel.Warning;
    const expectedLog = logFactory.createWarningLog(expectedMessage).build();

    driver.logWarning({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage, undefined);
  });
});
