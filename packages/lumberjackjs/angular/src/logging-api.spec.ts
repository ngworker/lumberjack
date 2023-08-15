import { isClass } from '@internal/core/test-util';

import { LumberjackLogger, LumberjackOrchestrator, ScopedLumberjackLogger } from './index';

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

    it(`exposes ${LumberjackOrchestrator.name}`, () => {
      const sut = LumberjackOrchestrator;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
