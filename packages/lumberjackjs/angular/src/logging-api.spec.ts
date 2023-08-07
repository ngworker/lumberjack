import { isClass } from '@internal/core/test-util';

import { LumberjackLogger, LumberjackService, ScopedLumberjackLogger } from './index';

describe('Logging API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackLogger.name}`, () => {
      const sut = LumberjackLogger;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${ScopedLumberjackLogger.name}`, () => {
      const sut = ScopedLumberjackLogger;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${LumberjackService.name}`, () => {
      const sut = LumberjackService;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
