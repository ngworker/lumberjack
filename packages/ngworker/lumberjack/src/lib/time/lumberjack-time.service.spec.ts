import { TestBed } from '@angular/core/testing';

import { provideLumberjack } from '../configuration/provide-lumberjack';

import { LumberjackTimeService } from './lumberjack-time.service';

describe(LumberjackTimeService.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack()],
    });
    service = TestBed.inject(LumberjackTimeService);
  });

  let service: LumberjackTimeService;

  describe('getUnixEpochTicks', () => {
    it('returns the current number of milliseconds since the Unix epoch', () => {
      const fakeDate = new Date('2020-10-10T20:20:20Z');
      const expectedTicks = fakeDate.valueOf();
      jest.spyOn(Date, 'now').mockReturnValue(expectedTicks);

      const actualTicks = service.getUnixEpochTicks();

      expect(actualTicks).toBe(expectedTicks);
    });
  });
});
