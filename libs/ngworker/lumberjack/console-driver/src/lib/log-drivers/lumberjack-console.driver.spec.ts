import { TestBed } from '@angular/core/testing';

import { SpyConsole, SpyConsoleModule } from '@internal/console-driver/test-util';
import { resolveDependency } from '@internal/test-util';
import {
  LumberjackLevel,
  LumberjackLogBuilder,
  LumberjackLogDriver,
  lumberjackLogDriverToken,
  LumberjackTimeService,
} from '@ngworker/lumberjack';

import { LumberjackConsoleDriverModule } from '../configuration/lumberjack-console-driver.module';
import { lumberjackConsoleToken } from '../console/lumberjack-console.token';

import { LumberjackConsoleDriver } from './lumberjack-console.driver';

describe(LumberjackConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LumberjackConsoleDriverModule.forRoot({
          levels: [LumberjackLevel.Verbose],
          identifier: LumberjackConsoleDriver.driverIdentifier,
        }),
        SpyConsoleModule,
      ],
    });

    const [_driver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
    driver = _driver as LumberjackConsoleDriver;
    spyLogger = resolveDependency(lumberjackConsoleToken) as SpyConsole;
  });

  let driver: LumberjackConsoleDriver;
  let spyLogger: SpyConsole;

  it("logs the critical level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Critical;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Critical,
      expectedMessage
    ).build();

    driver.logCritical({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = LumberjackLevel.Debug;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Debug,
      expectedMessage
    ).build();

    driver.logDebug({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = LumberjackLevel.Error;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Error,
      expectedMessage
    ).build();

    driver.logError({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = LumberjackLevel.Info;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Info,
      expectedMessage
    ).build();

    driver.logInfo({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = LumberjackLevel.Trace;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Trace,
      expectedMessage
    ).build();

    driver.logTrace({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = LumberjackLevel.Warning;
    const expectedLog = new LumberjackLogBuilder(
      resolveDependency(LumberjackTimeService),
      LumberjackLevel.Warning,
      expectedMessage
    ).build();

    driver.logWarning({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage, undefined);
  });
});
