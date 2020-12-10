import { Injectable, VERSION } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

import { LogPayload } from './log-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger<LogPayload> {
  public static scope = 'Forest App';

  constructor(lumberjack: LumberjackService<LogPayload>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  private payloadLogInfo: LogPayload = {
    angularVersion: VERSION.full,
  };

  forestOnFire = this.createCriticalLogger('The forest is on fire').withScope(AppLogger.scope).build();

  helloForest = this.createInfoLogger('HelloForest')
    .withScope(AppLogger.scope)
    .withPayload(this.payloadLogInfo)
    .build();
}
