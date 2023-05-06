import { isClass } from '@internal/angular/test-util';

import { LumberjackTimeService } from './index';

describe('Time API', () => {
  describe('Services', () => {
    it(`exposes ${LumberjackTimeService.name}`, () => {
      const sut = LumberjackTimeService;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
