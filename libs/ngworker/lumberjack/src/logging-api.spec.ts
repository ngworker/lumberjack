import { isClass } from '@internal/test-util';

import { LumberjackLogger, LumberjackService } from './index';

describe('Logging API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackLogger.name}`, () => {
      const sut = LumberjackLogger;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });

    it(`exposes ${LumberjackService.name}`, () => {
      const sut = LumberjackService;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
