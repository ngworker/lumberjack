import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';
import { LogDriverConfig, LogDriverConfigToken, LumberjackLogLevel } from '@ngworker/lumberjack';

import { ConsoleDriverConfigToken } from './console-driver-config.token';

const debugDriverConfig: LogDriverConfig = {
  levels: [LumberjackLogLevel.Debug],
};
const verboseDriverConfig: LogDriverConfig = {
  levels: [LumberjackLogLevel.Verbose],
};

describe('ConsoleDriverConfigToken', () => {
  describe('given a provided console driver config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LogDriverConfigToken, useValue: verboseDriverConfig },
          { provide: ConsoleDriverConfigToken, useValue: debugDriverConfig },
        ],
      });
    });

    it('then that config is resolved', () => {
      const actualDriverConfig = resolveDependency(ConsoleDriverConfigToken);

      expect(actualDriverConfig).toBe(debugDriverConfig);
    });
  });

  describe('given no provided console driver config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: LogDriverConfigToken, useValue: verboseDriverConfig }],
      });
    });

    it('then the log driver config is resolved', () => {
      const actualDriverConfig = resolveDependency(ConsoleDriverConfigToken);

      expect(actualDriverConfig).toBe(verboseDriverConfig);
    });
  });
});
