import { TestBed } from '@angular/core/testing';

import { NoopDriver, NoopDriverModule, resolveDependency } from '@internal/test-util';

import { LumberjackModule } from '../configuration/lumberjack.module';
import { LumberjackLogDriver } from '../log-drivers/lumberjack-log-driver';
import { LumberjackLogDriverError } from '../log-drivers/lumberjack-log-driver-error';
import { lumberjackLogDriverToken } from '../log-drivers/lumberjack-log-driver.token';
import { LumberjackLogBuilder } from '../logging/lumberjack-log.builder';
import { LumberjackLevel } from '../logs/lumberjack-level';
import { LumberjackLog } from '../logs/lumberjack.log';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

import { formatLogDriverError } from './format-log-driver-error';
import { lumberjackFormatLog } from './lumberjack-format-log';

describe(formatLogDriverError.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot(), NoopDriverModule.forRoot()],
    });
    const time = resolveDependency(LumberjackTimeService);
    const [_logDriver] = (resolveDependency(lumberjackLogDriverToken) as unknown) as LumberjackLogDriver[];
    logDriver = _logDriver;
    log = new LumberjackLogBuilder(time, LumberjackLevel.Info, 'Test info').build();
  });

  const errorMessage = 'Test error message';
  let log: LumberjackLog;
  let logDriver: NoopDriver;

  it('includes the message of an Error', () => {
    const logDriverError: LumberjackLogDriverError = {
      error: new Error(errorMessage),
      formattedLog: lumberjackFormatLog(log),
      log,
      logDriver,
    };

    const formattedError = formatLogDriverError(logDriverError);

    expect(formattedError).toContain(errorMessage);
  });

  it('includes a string message', () => {
    const logDriverError: LumberjackLogDriverError = {
      error: errorMessage,
      formattedLog: lumberjackFormatLog(log),
      log,
      logDriver,
    };

    const formattedError = formatLogDriverError(logDriverError);

    expect(formattedError).toContain(errorMessage);
  });
});
