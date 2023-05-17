import { LumberjackTimeService } from '@ngworker/lumberjack';

export class FakeTimeService extends LumberjackTimeService {
  #now = new Date();

  override getUnixEpochTicks(): number {
    return this.#now.valueOf();
  }
  setTime(fakeNow: Date): void {
    this.#now = fakeNow;
  }
}
