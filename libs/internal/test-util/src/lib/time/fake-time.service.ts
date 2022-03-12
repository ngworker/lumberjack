import { Injectable } from '@angular/core';

import { LumberjackTimeService } from '@ngworker/lumberjack';

@Injectable()
export class FakeTimeService extends LumberjackTimeService {
  private now = new Date();

  getUnixEpochTicks(): number {
    return this.now.valueOf();
  }
  setTime(fakeNow: Date): void {
    this.now = fakeNow;
  }
}
