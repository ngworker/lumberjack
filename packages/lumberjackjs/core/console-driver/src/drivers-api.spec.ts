import { isClass } from '@internal/core/test-util';

import { LumberjackConsoleDriver } from './index';

describe('Drivers API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackConsoleDriver.name}`, () => {
      const sut = LumberjackConsoleDriver;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
