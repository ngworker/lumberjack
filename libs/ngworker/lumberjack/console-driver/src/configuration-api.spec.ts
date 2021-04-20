import { isClass } from '@internal/test-util';

import { LumberjackConsoleDriverModule, LumberjackConsoleDriverRootModule } from './index';

describe('Configuration API', () => {
  describe('Angular modules', () => {
    it(`exposes ${LumberjackConsoleDriverModule.name}`, () => {
      const sut = LumberjackConsoleDriverModule;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${LumberjackConsoleDriverRootModule.name}`, () => {
      const sut = LumberjackConsoleDriverRootModule;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
