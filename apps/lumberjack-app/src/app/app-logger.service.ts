import { Injectable, VERSION } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

import { LogPayload } from './log-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger<LogPayload> {
  public static logContext = 'Forest App';

  constructor(lumberjack: LumberjackService<LogPayload>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  private payloadLogInfo: LogPayload = {
    angularVersion: VERSION.full,
  };

  forestOnFire = this.createCriticalLogger('The forest is on fire').withScope(AppLogger.logContext).build();

  helloForest = this.createInfoLogger('HelloForest')
    .withScope(AppLogger.logContext)
    .withPayload(this.payloadLogInfo)
    .build();
}
