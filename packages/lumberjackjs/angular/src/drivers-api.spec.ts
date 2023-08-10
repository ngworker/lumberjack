import { InjectionToken } from '@angular/core';

import { lumberjackDriverToken } from './index';

describe('Drivers API', () => {
  describe('Dependency injection tokens', () => {
    it('exposes lumberjackDriverToken', () => {
      const sut = lumberjackDriverToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
