import { InjectionToken } from '@angular/core';

import { lumberjackLogDriverToken } from './index';

describe('Log drivers API', () => {
  describe('Dependency injection tokens', () => {
    it('exposes lumberjackLogDriverToken', () => {
      const sut = lumberjackLogDriverToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
