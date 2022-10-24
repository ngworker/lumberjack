import { isClass } from '@internal/test-util';

import { LumberjackHttpDriver } from './index';

describe('Log drivers API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackHttpDriver.name}`, () => {
      const sut = LumberjackHttpDriver;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
