import { isClass } from '@internal/test-util';

import { LumberjackLogger, LumberjackService } from './index';

describe('Logging API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackLogger.name}`, () => {
      expect(isClass(LumberjackLogger)).withContext(`${LumberjackLogger.name} is not a class`).toBeTrue();
    });

    it(`exposes ${LumberjackService.name}`, () => {
      expect(isClass(LumberjackService)).withContext(`${LumberjackService.name} is not a class`).toBeTrue();
    });
  });
});
