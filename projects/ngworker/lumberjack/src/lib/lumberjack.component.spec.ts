import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { LumberjackComponent } from './lumberjack.component';

describe('LumberjackComponent', () => {
  let spectator: Spectator<LumberjackComponent>;
  const createComponent = createComponentFactory(LumberjackComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
