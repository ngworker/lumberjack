import { HttpClientModule } from '@angular/common/http';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { defaultLogConfig } from './configs/default-log.config';
import { LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { ConsoleDriverModule, HttpDriverModule, LogDriver, LogDriverToken } from './log-drivers';
import { ConsoleDriver } from './log-drivers/console-driver/console.driver';
import { HttpDriver } from './log-drivers/http-driver/http.driver';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackService } from './lumberjack.service';

describe('LumberjackService', () => {
  let spectator: SpectatorService<LumberjackService>;
  const createService = createServiceFactory({
    service: LumberjackService,
    imports: [
      ConsoleDriverModule.forRoot(),
      HttpDriverModule.forRoot({
        logWagonSize: 1,
        origin: 'TEST_LUMBERJACK_SERVICE',
        storeUrl: 'https://www.logstore.com',
        levels: [LumberjackLogLevel.Info, LumberjackLogLevel.Debug],
      }),
    ],
    providers: [{ provide: LumberjackLogConfigToken, useValue: defaultLogConfig }],
    mocks: [ConsoleDriver, HttpDriver],
  });

  beforeEach(() => (spectator = createService()));

  it('should be available with two drivers', () => {
    const drivers = spectator.inject<LogDriver[]>(LogDriverToken);

    expect(spectator.service).toBeTruthy();
    expect(drivers.length).toBe(2);
    expect(drivers[0]).toBeInstanceOf(ConsoleDriver);
    expect(drivers[1]).toBeInstanceOf(HttpDriver);
  });

  describe('log method', () => {
    it('should log to the right level', () => {
      const drivers = spectator.inject<LogDriver[]>(LogDriverToken);
      const consoleDriver = drivers[0] as ConsoleDriver;
      const httpDriver = drivers[1] as HttpDriver;
      const consoleSpyLogInfo = spyOn(consoleDriver, 'logInfo').and.callThrough();
      const httpSpyLogInfo = spyOn(httpDriver, 'logInfo').and.callThrough();
      const consoleSpyDebugInfo = spyOn(consoleDriver, 'logDebug').and.callThrough();
      const httpSpyDebugInfo = spyOn(httpDriver, 'logDebug').and.callThrough();

      const infoLog: LumberjackLog = {
        context: 'Lumberjack Service',
        level: LumberjackLogLevel.Info,
        message: 'Testing a log info',
      };
      const debugLog: LumberjackLog = {
        context: 'Lumberjack Service',
        level: LumberjackLogLevel.Debug,
        message: 'Testing a log debug',
      };

      spectator.service.log(infoLog);
      expect(consoleSpyLogInfo).toHaveBeenCalledTimes(1);
      expect(httpSpyLogInfo).toHaveBeenCalledTimes(1);
      expect(consoleSpyDebugInfo).not.toHaveBeenCalled();
      spectator.service.log(debugLog);
      expect(consoleSpyDebugInfo).toHaveBeenCalledTimes(1);
      expect(httpSpyDebugInfo).toHaveBeenCalledTimes(1);
    });
  });

  it('should log to the configured levels', () => {
    const drivers = spectator.inject<LogDriver[]>(LogDriverToken);
    const consoleDriver = drivers[0] as ConsoleDriver;
    const httpDriver = drivers[1] as HttpDriver;
    const consoleSpyError = spyOn(consoleDriver, 'logError').and.callThrough();
    const httpSpyError = spyOn(httpDriver, 'logError').and.callThrough();

    const errorLog: LumberjackLog = {
      context: 'Lumberjack Service',
      level: LumberjackLogLevel.Error,
      message: 'Testing a log error',
    };

    spectator.service.log(errorLog);
    expect(consoleSpyError).toHaveBeenCalledTimes(1);
    expect(httpSpyError).not.toHaveBeenCalledTimes(1);
  });
});
