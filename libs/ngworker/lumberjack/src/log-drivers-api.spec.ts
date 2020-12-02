import { InjectionToken } from '@angular/core';

import { LogDriver, lumberjackLogDriverToken } from './index';

describe('Log drivers API', () => {
  describe('Interfaces', () => {
    it('exposes LogDriver', () => {
      const value: LogDriver | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Dependency injection tokens', () => {
    it('exposes lumberjackLogDriverToken', () => {
      const sut = lumberjackLogDriverToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
