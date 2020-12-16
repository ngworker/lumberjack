import { LumberjackTimeService } from '@ngworker/lumberjack';

export class FakeTimeService extends LumberjackTimeService {
  private fakeDate = new Date('2020-02-02T02:02:02.000Z');

  getUnixEpochTicks(): number {
    return this.fakeDate.valueOf();
  }
}
