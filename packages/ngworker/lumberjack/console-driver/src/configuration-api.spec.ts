import { isFunction } from '@internal/test-util';

import { provideLumberjackConsoleDriver } from './index';

describe('Configuration API', () => {
  describe('Provider functions', () => {
    it(`exposes ${provideLumberjackConsoleDriver.name}`, () => {
      const sut = provideLumberjackConsoleDriver;

      expect(isFunction(sut)).toBeTruthy();
    });
  });
});
