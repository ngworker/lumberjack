import { HelloForrest } from './log-types/info-logs';
import { ForrestOnFire } from './log-types/error-logs';
import { Component } from '@angular/core';
import { LumberjackService } from '@ngworker/lumberjack';

@Component({
  selector: 'app-root',
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
