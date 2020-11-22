import { Injectable } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  private static logContext = 'App';

  constructor(lumberjack: LumberjackService, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  forestOnFire = this.createCriticalLogger('The forest is on fire', AppLogger.logContext);

  helloForest = this.createInfoLogger('HelloForest', AppLogger.logContext);
}
