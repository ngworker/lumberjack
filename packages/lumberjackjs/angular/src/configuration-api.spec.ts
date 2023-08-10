import { InjectionToken } from '@angular/core';

import { isClass, isFunction } from '@internal/core/test-util';

import {
  lumberjackConfigToken,
  lumberjackDriverConfigToken,
  LumberjackModule,
  LumberjackRootModule,
  provideLumberjack,
  provideLumberjackCustomDrivers,
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

    it(`exposes ${provideLumberjackCustomDrivers.name}`, () => {
      const sut = provideLumberjackCustomDrivers;

      expect(isFunction(sut)).toBeTruthy();
    });
  });

  describe('Dependency injection tokens', () => {
    it('exposes lumberjackConfigToken', () => {
      const sut = lumberjackConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });

    it('exposes lumberjackDriverConfigToken', () => {
      const sut = lumberjackDriverConfigToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
