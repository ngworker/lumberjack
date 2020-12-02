import { InjectionToken } from '@angular/core';

import { isClass } from '@internal/test-util';

import {
  LumberjackConfig,
  lumberjackLogConfigToken,
  LumberjackLogDriverConfig,
  lumberjackLogDriverConfigToken,
  LumberjackLogFormatFunction,
  LumberjackLogOptions,
  LumberjackModule,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLogDriverConfig', () => {
      const value: LumberjackLogDriverConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackConfig', () => {
      const value: LumberjackConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackLogFormatFunction', () => {
      const value: LumberjackLogFormatFunction | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogOptions', () => {
      const value: LumberjackLogOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Angular modules', () => {
    it(`exposes ${LumberjackModule.name}`, () => {
      const sut = LumberjackModule;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });

  describe('Dependency injection tokens', () => {
    it('exposes lumberjackLogDriverConfigToken', () => {
      const sut = lumberjackLogDriverConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });

    it('exposes lumberjackLogConfigToken', () => {
      const sut = lumberjackLogConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
