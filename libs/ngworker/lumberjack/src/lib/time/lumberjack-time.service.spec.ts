import { resolveDependency } from '@internal/test-util';

import { LumberjackTimeService } from './lumberjack-time.service';

describe(LumberjackTimeService.name, () => {
  beforeEach(() => {
    service = resolveDependency(LumberjackTimeService);
  });

  let service: LumberjackTimeService;

  describe('getUnixEpocTicks', () => {
    it('returns the current number of milliseconds since the Unix epoch', () => {
      const fakeDate = new Date('2020-10-10T20:20:20Z');
      const expectedTicks = fakeDate.valueOf();
      spyOn(Date, 'now').and.returnValue(expectedTicks);

      const actualTicks = service.getUnixEpochTicks();

      expect(actualTicks).toBe(expectedTicks);
    });
  });
});
