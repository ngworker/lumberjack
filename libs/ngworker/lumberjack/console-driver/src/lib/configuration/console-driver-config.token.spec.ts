import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';
import { LumberjackLevel, LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { consoleDriverConfigToken } from './console-driver-config.token';

const debugDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Debug],
};
const verboseDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Verbose],
};

describe('consoleDriverConfigToken', () => {
  describe('given a provided console log driver config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: lumberjackLogDriverConfigToken, useValue: verboseDriverConfig },
          { provide: consoleDriverConfigToken, useValue: debugDriverConfig },
        ],
      });
    });

    it('then that config is resolved', () => {
      const actualDriverConfig = resolveDependency(consoleDriverConfigToken);

      expect(actualDriverConfig).toBe(debugDriverConfig);
    });
  });

  describe('given no provided console log driver config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: lumberjackLogDriverConfigToken, useValue: verboseDriverConfig }],
      });
    });

    it('then the value of the log driver config is resolved', () => {
      const actualDriverConfig = resolveDependency(consoleDriverConfigToken);

      expect(actualDriverConfig).toBe(verboseDriverConfig);
    });
  });
});
