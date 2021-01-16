import { TestBed } from '@angular/core/testing';

import { resolveDependency } from '@internal/test-util';
import { LumberjackLevel, LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { LumberjackConsoleDriver } from '../log-drivers/lumberjack-console.driver';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';

const debugDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Debug],
  identifier: 'TestConsoleDriver',
};
const verboseDriverConfig: Partial<LumberjackLogDriverConfig> = {
  levels: [LumberjackLevel.Verbose],
};
const verboseConsoleDriverConfig: LumberjackLogDriverConfig = {
  levels: [LumberjackLevel.Verbose],
  identifier: LumberjackConsoleDriver.name,
};

describe('consoleDriverConfigToken', () => {
  describe('given a provided console log driver config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: lumberjackLogDriverConfigToken, useValue: verboseDriverConfig },
          { provide: lumberjackConsoleDriverConfigToken, useValue: debugDriverConfig },
        ],
      });
    });

    it('then that config is resolved', () => {
      const actualDriverConfig = resolveDependency(lumberjackConsoleDriverConfigToken);

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
      const actualDriverConfig = resolveDependency(lumberjackConsoleDriverConfigToken);

      expect(actualDriverConfig).toEqual(verboseConsoleDriverConfig);
    });
  });
});
