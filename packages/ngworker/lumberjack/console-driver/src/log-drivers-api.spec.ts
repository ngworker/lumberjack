import { isClass } from '@internal/angular/test-util';

import { LumberjackConsoleDriver } from './index';

describe('Log drivers API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackConsoleDriver.name}`, () => {
      const sut = LumberjackConsoleDriver;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
