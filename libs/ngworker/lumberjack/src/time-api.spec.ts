import { isClass } from '@internal/test-util';

import { LumberjackTimeService } from './index';

describe('Time API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackTimeService.name}`, () => {
      const sut = LumberjackTimeService;

      expect(isClass(sut)).withContext(`${sut.name} is not a class`).toBeTrue();
    });
  });
});
