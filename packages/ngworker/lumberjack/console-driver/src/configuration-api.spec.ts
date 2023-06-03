import { isClass, isFunction } from '@internal/core/test-util';

import {
  LumberjackConsoleDriverModule,
  LumberjackConsoleDriverRootModule,
  provideLumberjackConsoleDriver,
} from './index';

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

  describe('Provider functions', () => {
    it(`exposes ${provideLumberjackConsoleDriver.name}`, () => {
      const sut = provideLumberjackConsoleDriver;

      expect(isFunction(sut)).toBeTruthy();
    });
  });
});
