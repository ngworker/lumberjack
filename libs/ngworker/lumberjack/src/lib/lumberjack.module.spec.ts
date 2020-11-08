import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';

import { LogDriverConfig, LogDriverConfigToken, LumberjackLogConfig, LumberjackLogConfigToken } from './configs';
import { LumberjackLogLevel } from './lumberjack-log-levels';
import { LumberjackModule } from './lumberjack.module';

describe(LumberjackModule.name, () => {
  it(`cannot be imported without using the ${LumberjackModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(LumberjackModule);
  });

  describe(LumberjackModule.forRoot.name, () => {
    it('accepts a log configuration', () => {
      const expectedConfig: LumberjackLogConfig = {
        format: ({ message }) => message,
        levels: [LumberjackLogLevel.Debug],
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(expectedConfig)],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('provides a default log configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      const actualConfig = resolveDependency(LumberjackLogConfigToken);
      expect(actualConfig).toEqual({
        format: jasmine.any(Function),
        levels: jasmine.any(Array),
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });
      const logConfig = resolveDependency(LumberjackLogConfigToken);
      const defaultLogDriverConfig: LogDriverConfig = {
        levels: logConfig.levels,
      };

      const actualConfig = resolveDependency(LogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });
  });
});
