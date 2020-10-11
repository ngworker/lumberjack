import { TestBed } from '@angular/core/testing';

import {
  defaultLogConfig,
  defaultLogDriverConfig,
  LogDriverConfigToken,
  LumberjackLogConfig,
  LumberjackLogConfigToken,
} from './configs';
import { LumberjackModule } from './lumberjack.module';

describe(LumberjackModule.name, () => {
  it('can be imported directly (without calling forRoot', () => {
    const resolveLumberjackModule = () => TestBed.inject(LumberjackModule);

    TestBed.configureTestingModule({
      imports: [LumberjackModule],
    });

    expect(resolveLumberjackModule).not.toThrow();
  });

  describe('forRoot', () => {
    it('accepts a log configuration', () => {
      const expectedConfig: LumberjackLogConfig = {
        format: ({ message }) => message,
      };

      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot(expectedConfig)],
      });

      const actualConfig = TestBed.inject(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('provides a default log configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      const actualConfig = TestBed.inject(LumberjackLogConfigToken);
      expect(actualConfig).toEqual(defaultLogConfig);
    });

    it('provides a default log driver configuration', () => {
      TestBed.configureTestingModule({
        imports: [LumberjackModule.forRoot()],
      });

      const actualConfig = TestBed.inject(LogDriverConfigToken);
      expect(actualConfig).toEqual(defaultLogDriverConfig);
    });
  });
});
