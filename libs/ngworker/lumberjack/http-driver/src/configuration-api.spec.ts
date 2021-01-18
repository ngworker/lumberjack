import { isClass } from '@internal/test-util';

import {
  LumberjackHttpDriverConfig,
  LumberjackHttpDriverModule,
  LumberjackHttpDriverOptions,
  LumberjackHttpDriverRetryOptions,
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

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
