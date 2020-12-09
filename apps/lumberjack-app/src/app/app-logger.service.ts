import { Injectable } from '@angular/core';

import { LumberjackLogger, LumberjackService, LumberjackTimeService } from '@ngworker/lumberjack';

import { ExtraLogInfo } from './extra-log-info';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends LumberjackLogger<ExtraLogInfo> {
  public static logContext = 'Forest App';

  constructor(lumberjack: LumberjackService<ExtraLogInfo>, time: LumberjackTimeService) {
    super(lumberjack, time);
  }

  private extraLogInfo: ExtraLogInfo = {
    angularVersion: '11.0.0',
  };

  forestOnFire = this.createCriticalLogger('The forest is on fire').withScope(AppLogger.logContext).log();

  helloForest = this.createInfoLogger('HelloForest').withScope(AppLogger.logContext).withExtra(this.extraLogInfo).log();
}
