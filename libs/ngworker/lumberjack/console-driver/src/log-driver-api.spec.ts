import { isClass } from '@internal/test-util';

import { ConsoleDriver } from './index';

describe('Log driver API', () => {
  describe('Services', () => {
    it(`exposes ${ConsoleDriver.name}`, () => {
      const sut = ConsoleDriver;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
