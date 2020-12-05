import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { NoopConsoleModule } from '@internal/console-driver/test-util';
import { LumberjackLevel, LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { LumberjackHttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      HttpClientTestingModule,
      LumberjackModule.forRoot(),
      LumberjackConsoleDriverModule.forRoot(),
      NoopConsoleModule,
      LumberjackHttpDriverModule.forRoot({
        levels: [LumberjackLevel.Error],
        origin: 'ForestAPP',
        storeUrl: '/api/logs',
        retryOptions: { maxRetries: 5, delayMs: 250 },
      }),
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it(`should have as title 'lumberjack'`, () => {
    expect(spectator.component.title).toEqual('lumberjack');
  });

  it('should render title', () => {
    const query = spectator.query('.content span');
    expect(query && query.textContent).toContain('lumberjack app is running!');
  });
});
