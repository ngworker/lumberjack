import { InjectionToken } from '@angular/core';

import { isClass } from '@internal/test-util';

import { lumberjackConfigToken, lumberjackLogDriverConfigToken, LumberjackModule, LumberjackRootModule } from './index';

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
