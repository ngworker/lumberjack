import { InjectionToken } from '@angular/core';

import { isClass } from '@internal/test-util';

import {
  httpDriverConfigToken,
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

  describe('Dependency injection tokens', () => {
    it('exposes httpDriverConfigToken', () => {
      const sut = httpDriverConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });

  describe('Angular modules', () => {
    it(`exposes ${LumberjackHttpDriverModule.name}`, () => {
      const sut = LumberjackHttpDriverModule;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
