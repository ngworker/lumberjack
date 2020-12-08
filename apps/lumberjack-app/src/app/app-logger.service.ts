import { Injectable } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  public static scope = 'Forest App';

  constructor(lumberjack: LumberjackService, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createCriticalLogger('The forest is on fire', AppLogger.scope);

  helloForest = this.createInfoLogger('HelloForest', AppLogger.scope);
}
