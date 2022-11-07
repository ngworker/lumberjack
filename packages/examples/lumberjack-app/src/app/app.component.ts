import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppLogger } from './app-logger.service';
import { ForestService } from './forest.service';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent],

  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly forest = inject(ForestService);
  private readonly logger = inject(AppLogger);
  private readonly subscriptions = new Subscription();

  readonly title = 'lumberjack-app';

  ngOnInit(): void {
    this.logger.helloForest();

    this.subscriptions.add(this.forest.fire$.subscribe(() => this.logger.forestOnFire()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
