import { Component, OnInit } from '@angular/core';

import { AppLogger } from './app-logger.service';

@Component({
  selector: 'ngworker-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'lumberjack';

  constructor(private logger: AppLogger) {}

  ngOnInit(): void {
    this.logger.helloForest();
    this.logger.forestOnFire();
  }
}
