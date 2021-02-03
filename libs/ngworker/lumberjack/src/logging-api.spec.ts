import { isClass } from '@internal/test-util';

import { LumberjackLogFactory, LumberjackLogger, LumberjackService, ScopedLumberjackLogger } from './index';

describe('Logging API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackLogFactory.name}`, () => {
      const sut = LumberjackLogger;

      expect(isClass(sut)).toBeTruthy();
    });

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
