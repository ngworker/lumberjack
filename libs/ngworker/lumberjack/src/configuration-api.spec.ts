import { InjectionToken } from '@angular/core';

import { isClass } from '@internal/test-util';

import {
  LogDriverConfig,
  logDriverConfigToken,
  LumberjackLogConfig,
  lumberjackLogConfigToken,
  LumberjackLogFormatFunction,
  LumberjackLogOptions,
  LumberjackModule,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LogDriverConfig', () => {
      const value: LogDriverConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogConfig', () => {
      const value: LumberjackLogConfig | undefined = undefined;

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
    it('exposes logDriverConfigToken', () => {
      const sut = logDriverConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });

    it('exposes lumberjackLogConfigToken', () => {
      const sut = lumberjackLogConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
