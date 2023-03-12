import { isClass } from '@internal/test-util';

import {
  LumberjackHttpDriverConfig,
  LumberjackHttpDriverModule,
  LumberjackHttpDriverOptions,
  LumberjackHttpDriverRetryOptions,
  LumberjackHttpDriverRootModule,
  provideLumberjackHttpDriver,
  withConfig,
  withOptions
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

    it('exposes provideLumberjackHttpDriver and its configurations', () => {
      const value: typeof provideLumberjackHttpDriver | undefined = undefined;
      const config: typeof withConfig | undefined = undefined;
      const options: typeof withOptions | undefined = undefined;

      expect(value).toBeUndefined();
      expect(config).toBeUndefined();
      expect(options).toBeUndefined();
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
