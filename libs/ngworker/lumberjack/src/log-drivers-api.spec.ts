import { InjectionToken } from '@angular/core';

import { LumberjackLogDriver, LumberjackLogDriverLog, lumberjackLogDriverToken } from './index';

describe('Log drivers API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLogDriver', () => {
      const value: LumberjackLogDriver | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogDriverLog', () => {
      const value: LumberjackLogDriverLog | undefined = undefined;

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
