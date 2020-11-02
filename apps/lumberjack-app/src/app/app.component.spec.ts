import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';
import { ConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { HttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      HttpClientTestingModule,
      LumberjackModule.forRoot(),
      ConsoleDriverModule.forRoot(),
      HttpDriverModule.forRoot({
        levels: [LumberjackLogLevel.Error],
        logWagonSize: 5,
        origin: 'ForestAPP',
        storeUrl: '/api/logs',
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
