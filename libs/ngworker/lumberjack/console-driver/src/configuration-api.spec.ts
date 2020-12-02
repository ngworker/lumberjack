import { isClass } from '@internal/test-util';

import { LumberjackConsoleDriverModule } from './index';

describe('Configuration API', () => {
  describe('Angular modules', () => {
    it(`exposes ${LumberjackConsoleDriverModule.name}`, () => {
      const sut = LumberjackConsoleDriverModule;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
