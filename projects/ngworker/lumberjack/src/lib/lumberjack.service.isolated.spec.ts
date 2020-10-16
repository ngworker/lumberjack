import { TestBed } from '@angular/core/testing';

import { LogDriverConfig, LogDriverConfigToken } from './configs';
import { createDebugLog } from './log-types';
import { LumberjackModule } from './lumberjack.module';
import { LumberjackService } from './lumberjack.service';

const allLogLevelsDisabled: LogDriverConfig = {
  levels: [],
};
const createEmptyDebugLog = createDebugLog('');
const logEmptyDebugMessage = () => TestBed.get(LumberjackService).log(createEmptyDebugLog());

describe(LumberjackService.name, () => {
  it('accepts logs when no log drivers are registered', () => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
    });

    expect(logEmptyDebugMessage).not.toThrow();
  });

  it('accepts logs when all log levels are disabled', () => {
    TestBed.configureTestingModule({
      imports: [LumberjackModule.forRoot()],
      providers: [{ provide: LogDriverConfigToken, useValue: allLogLevelsDisabled }],
    });

    expect(logEmptyDebugMessage).not.toThrow();
  });
});
