import { isClass } from '@internal/core/test-util';

import { LumberjackAngularHttpDriver } from './index';

describe('Drivers API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackAngularHttpDriver.name}`, () => {
      const sut = LumberjackAngularHttpDriver;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
