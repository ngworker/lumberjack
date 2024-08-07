import { TestBed } from '@angular/core/testing';

import { provideSpyConsole, SpyConsole } from '@internal/console-driver/test-util';
import {
  LumberjackLogDriver,
  lumberjackLogDriverToken,
  LumberjackLogFactory,
  provideLumberjack,
} from '@ngworker/lumberjack';

import { lumberjackConsoleToken } from '../console/lumberjack-console.token';
import { provideLumberjackConsoleDriver } from '../configuration/provide-lumberjack-console-driver';

import { LumberjackConsoleDriver } from './lumberjack-console.driver';

describe(LumberjackConsoleDriver.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideLumberjack(),
        provideLumberjackConsoleDriver({
          levels: ['verbose'],
          identifier: LumberjackConsoleDriver.driverIdentifier,
        }),
        provideSpyConsole(),
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
    const expectedMessage = 'critical';
    const expectedLog = logFactory.createCriticalLog(expectedMessage).build();

    driver.logCritical({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the debug level to the console's debug channel", () => {
    const expectedMessage = 'debug';
    const expectedLog = logFactory.createDebugLog(expectedMessage).build();

    driver.logDebug({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.debug).toHaveBeenCalledTimes(1);
    expect(spyLogger.debug).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the error level to the console's error channel", () => {
    const expectedMessage = 'error';
    const expectedLog = logFactory.createErrorLog(expectedMessage).build();

    driver.logError({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.error).toHaveBeenCalledTimes(1);
    expect(spyLogger.error).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the info level to the console's info channel", () => {
    const expectedMessage = 'info';
    const expectedLog = logFactory.createInfoLog(expectedMessage).build();

    driver.logInfo({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.info).toHaveBeenCalledTimes(1);
    expect(spyLogger.info).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the trace level to the console's trace channel", () => {
    const expectedMessage = 'trace';
    const expectedLog = logFactory.createTraceLog(expectedMessage).build();

    driver.logTrace({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.trace).toHaveBeenCalledTimes(1);
    expect(spyLogger.trace).toHaveBeenCalledWith(expectedMessage, undefined);
  });

  it("logs the warning level to the console's warn channel", () => {
    const expectedMessage = 'warn';
    const expectedLog = logFactory.createWarningLog(expectedMessage).build();

    driver.logWarning({ formattedLog: expectedMessage, log: expectedLog });

    expect(spyLogger.warn).toHaveBeenCalledTimes(1);
    expect(spyLogger.warn).toHaveBeenCalledWith(expectedMessage, undefined);
  });
});
