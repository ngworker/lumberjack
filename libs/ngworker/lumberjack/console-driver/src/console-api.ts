import { InjectionToken } from '@angular/core';

import { LumberjackConsole, lumberjackConsoleToken } from './index';

describe('Console API', () => {
  describe('Types', () => {
    it('exposes LumberjackConsole', () => {
      const value: LumberjackConsole | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Dependency injection tokens', () => {
    it('exposes lumberjackConsoleToken', () => {
      const sut = lumberjackConsoleToken;

      expect(sut).toBeInstanceOf(InjectionToken);
    });
  });
});
