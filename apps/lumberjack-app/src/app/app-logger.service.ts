import { Injectable } from '@angular/core';

import { LumberjackLogger } from '@ngworker/lumberjack';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger {
  private static logContext = 'App';

  forestOnFire = this.createErrorLogger('The forest is on fire', AppLogger.logContext);

  helloForest = this.createInfoLogger('HelloForest', AppLogger.logContext);
}
