import { isClass } from '@internal/test-util';

import { LumberjackTimeService } from './index';

describe('Time API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackTimeService.name}`, () => {
      expect(isClass(LumberjackTimeService)).withContext(`${LumberjackTimeService.name} is not a class`).toBeTrue();
    });
  });
});
