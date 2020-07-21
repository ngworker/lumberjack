import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ConsoleDriverModule, LumberjackModule } from '@ngworker/lumberjack';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [LumberjackModule.forRoot(), ConsoleDriverModule.forRoot()],
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
    expect(spectator.query('.content span').textContent).toContain('lumberjack app is running!');
  });
});
