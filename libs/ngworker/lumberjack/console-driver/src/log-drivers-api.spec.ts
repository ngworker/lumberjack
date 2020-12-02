import { isClass } from '@internal/test-util';

import { LumberjackConsoleDriver } from './index';

describe('Log drivers API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackConsoleDriver.name}`, () => {
      const sut = LumberjackConsoleDriver;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
