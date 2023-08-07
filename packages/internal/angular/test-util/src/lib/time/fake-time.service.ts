import { Injectable } from '@angular/core';

import { LumberjackTimeService } from '@lumberjackjs/angular';

@Injectable()
export class FakeTimeService extends LumberjackTimeService {
  #now = new Date();

  override getUnixEpochTicks(): number {
    return this.#now.valueOf();
  }
  setTime(fakeNow: Date): void {
    this.#now = fakeNow;
  }
}
