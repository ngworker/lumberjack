import { Component } from '@angular/core';

import { LumberjackService } from '@ngworker/lumberjack';

import { ForestOnFire } from './log-types/error-logs';
import { HelloForest } from './log-types/info-logs';

@Component({
  selector: 'ngworker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'lumberjack';

  constructor(private lumberjack: LumberjackService) {
    this.lumberjack.log(HelloForest());
    this.lumberjack.log(ForestOnFire());
  }
}
