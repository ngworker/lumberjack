import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppLogger } from './app-logger.service';
import { ForestService } from './forest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  title = 'lumberjack-app';

  constructor(private logger: AppLogger, private forest: ForestService) {}

  ngOnInit(): void {
    this.logger.helloForest();

    this.subscriptions.add(this.forest.fire$.subscribe(() => this.logger.forestOnFire()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
