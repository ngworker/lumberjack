import { Injectable, VERSION } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

import { LogPayload } from './log-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger<LogPayload> {
  private static payload: LogPayload = {
    angularVersion: VERSION.full,
  };

  public static scope = 'Forest App';

  constructor(lumberjack: LumberjackService<LogPayload>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createCriticalLogger('The forest is on fire').withScope(AppLogger.scope).build();

  helloForest = this.createInfoLogger('HelloForest').withScope(AppLogger.scope).withPayload(AppLogger.payload).build();
}
