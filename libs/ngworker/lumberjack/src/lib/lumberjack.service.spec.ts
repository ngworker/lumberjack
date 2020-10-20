import { createHttpFactory, SpectatorService } from '@ngneat/spectator';

import { ConsoleDriver, ConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { HttpDriver, HttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { LogDriver, LogDriverToken } from './log-drivers';
import { LumberjackLog } from './lumberjack-log';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackService } from './lumberjack.service';

describe('LumberjackService', () => {
  const createService = createHttpFactory({
    service: LumberjackService,
    imports: [
      LumberjackModule.forRoot(),
      ConsoleDriverModule.forRoot({
        levels: [LumberjackLogLevel.Verbose],
      }),
      HttpDriverModule.forRoot({
        logWagonSize: 1,
        origin: 'TEST_LUMBERJACK_SERVICE',
        storeUrl: 'https://www.logstore.com',
        levels: [LumberjackLogLevel.Info, LumberjackLogLevel.Debug],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    const [consoleDriver, httpDriver] = spectator.inject<LogDriver[]>(LogDriverToken);
    consoleDriverSpy = consoleDriver as jasmine.SpyObj<ConsoleDriver>;
    spyOn(consoleDriverSpy, 'logDebug');
    spyOn(consoleDriverSpy, 'logError');
    spyOn(consoleDriverSpy, 'logInfo');
    spyOn(consoleDriverSpy, 'logWarning');
    httpDriverSpy = httpDriver as jasmine.SpyObj<HttpDriver>;
    spyOn(httpDriverSpy, 'logDebug');
    spyOn(httpDriverSpy, 'logError');
    spyOn(httpDriverSpy, 'logInfo');
    spyOn(httpDriverSpy, 'logWarning');
  });

  let consoleDriverSpy: jasmine.SpyObj<ConsoleDriver>;
  let httpDriverSpy: jasmine.SpyObj<HttpDriver>;
  let spectator: SpectatorService<LumberjackService>;

  it('should be available with two drivers', () => {
    const drivers = spectator.inject<LogDriver[]>(LogDriverToken);

    expect(spectator.service).toBeTruthy();
    expect(drivers).toEqual([jasmine.any(ConsoleDriver), jasmine.any(HttpDriver)]);
  });

  describe('log method', () => {
    it('should log to the right level', () => {
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
      expect(consoleDriverSpy.logInfo).toHaveBeenCalledTimes(1);
      expect(httpDriverSpy.logInfo).toHaveBeenCalledTimes(1);
      expect(consoleDriverSpy.logDebug).not.toHaveBeenCalled();
      spectator.service.log(debugLog);
      expect(consoleDriverSpy.logDebug).toHaveBeenCalledTimes(1);
      expect(httpDriverSpy.logDebug).toHaveBeenCalledTimes(1);
    });
  });

  it('should log to the configured levels', () => {
    const errorLog: LumberjackLog = {
      context: 'Lumberjack Service',
      level: LumberjackLogLevel.Error,
      message: 'Testing a log error',
    };

    spectator.service.log(errorLog);
    expect(consoleDriverSpy.logError).toHaveBeenCalledTimes(1);
    expect(httpDriverSpy.logError).not.toHaveBeenCalled();
  });
});
