import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';

import { defaultLogDriverConfig, LogDriverConfigToken, LumberjackLogConfig, LumberjackLogConfigToken } from './configs';
import { LumberjackModule } from './lumberjack.module';

describe(LumberjackModule.name, () => {
  it(`cannot be imported without using the ${LumberjackModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(LumberjackModule);
  });

  describe(LumberjackModule.forRoot.name, () => {
    it('accepts a log configuration', () => {
      const expectedConfig: LumberjackLogConfig = {
        format: ({ message }) => message,
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
      });
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      const actualConfig = resolveDependency(LogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });
  });
});
