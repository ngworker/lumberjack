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

  describe('utcTimeStampFor', () => {
    it('formats an ISO-8601 date-time string with 0 hours UTC offset and milliseconds resolution', () => {
      const expectedText = '2020-07-01T00:00:00.000Z';
      const ticks = new Date(expectedText).valueOf();

      const actualText = service.utcTimestampFor(ticks);

      expect(actualText).toBe(expectedText);
    });
  });
});
