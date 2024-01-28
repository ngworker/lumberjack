import { TestBed } from '@angular/core/testing';

import { LumberjackLogDriverConfig, lumberjackLogDriverConfigToken } from '@ngworker/lumberjack';

import { lumberjackConsoleDriverConfigToken } from './lumberjack-console-driver-config.token';

const debugDriverConfig: LumberjackLogDriverConfig = {
  levels: ['debug'],
  identifier: 'TestConsoleDriver',
};
const verboseDriverConfig: Partial<LumberjackLogDriverConfig> = {
  levels: ['verbose'],
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
      const actualDriverConfig = TestBed.inject(lumberjackConsoleDriverConfigToken);

      expect(actualDriverConfig).toStrictEqual(debugDriverConfig);
    });
  });
});
