import { Injectable } from '@angular/core';

import { resolveDependency } from '@internal/test-util';
import { LumberjackTimeService } from '@ngworker/lumberjack';

import { fakeDateToken } from './fake-date-token';

@Injectable({ providedIn: 'root' })
export class FakeTimeService extends LumberjackTimeService {
  getUnixEpochTicks(): number {
    return resolveDependency(fakeDateToken).valueOf();
  }
}
