import { isClass } from '@internal/test-util';

import { HttpDriver } from './index';

describe('Log drivers API', () => {
  describe('Services', () => {
    it(`exposes ${HttpDriver.name}`, () => {
      const sut = HttpDriver;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
