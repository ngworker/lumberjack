import { InjectionToken } from '@angular/core';

import { isClass } from '@internal/core/test-util';

import {
  lumberjackConfigToken,
  lumberjackLogDriverConfigToken,
  LumberjackModule,
  LumberjackRootModule,
  provideLumberjack,
} from './index';

describe('Configuration API', () => {
  describe('Angular modules', () => {
    it(`exposes ${LumberjackModule.name}`, () => {
      const sut = LumberjackModule;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${LumberjackRootModule.name}`, () => {
      const sut = LumberjackRootModule;

      expect(isClass(sut)).toBeTruthy();
    });
  });

  describe('Provider functions', () => {
    it(`exposes ${provideLumberjack.name}`, () => {
      const sut = provideLumberjack;

      expect(isFunction(sut)).toBeTruthy();
    });
  });

  describe('Dependency injection tokens', () => {
    it('exposes lumberjackConfigToken', () => {
      const sut = lumberjackConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });

    it('exposes lumberjackLogDriverConfigToken', () => {
      const sut = lumberjackLogDriverConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
