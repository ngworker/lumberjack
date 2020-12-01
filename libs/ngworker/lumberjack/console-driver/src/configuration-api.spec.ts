import { isClass } from '@internal/test-util';

import { ConsoleDriverModule } from './index';

describe('Configuration API', () => {
  describe('Angular modules', () => {
    it(`exposes ${ConsoleDriverModule.name}`, () => {
      const sut = ConsoleDriverModule;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
