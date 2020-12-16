import { Injectable, VERSION } from '@angular/core';

import { LumberjackService, LumberjackTimeService, ScopedLumberjackLogger } from '@ngworker/lumberjack';

import { LogPayload } from './log-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger<LogPayload> {
  private static payload: LogPayload = {
    angularVersion: VERSION.full,
  };

  public scope = 'Forest App';

  constructor(lumberjack: LumberjackService<LogPayload>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createCriticalLogger('The forest is on fire').build();

  helloForest = this.createInfoLogger('HelloForest').withPayload(AppLogger.payload).build();
}
