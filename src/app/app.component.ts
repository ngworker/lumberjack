import { Component } from '@angular/core';

import { LumberjackService } from '@ngworker/lumberjack';

import { ForrestOnFire } from './log-types/error-logs';
import { HelloForrest } from './log-types/info-logs';

@Component({
  selector: 'ngworker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lumberjack';

  constructor(private lumberjack: LumberjackService) {
    this.lumberjack.log(HelloForrest());
    this.lumberjack.log(ForrestOnFire());
  }
}
