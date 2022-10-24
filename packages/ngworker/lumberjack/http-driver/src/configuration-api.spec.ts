import { isClass } from '@internal/test-util';

import {
  LumberjackHttpDriverConfig,
  LumberjackHttpDriverModule,
  LumberjackHttpDriverOptions,
  LumberjackHttpDriverRetryOptions,
  LumberjackHttpDriverRootModule,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackHttpDriverConfig', () => {
      const value: LumberjackHttpDriverConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackHttpDriverRetryOptions', () => {
      const value: LumberjackHttpDriverRetryOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackHttpDriverOptions', () => {
      const value: LumberjackHttpDriverOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Angular modules', () => {
    it(`exposes ${LumberjackHttpDriverModule.name}`, () => {
      const sut = LumberjackHttpDriverModule;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${LumberjackHttpDriverRootModule.name}`, () => {
      const sut = LumberjackHttpDriverRootModule;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
