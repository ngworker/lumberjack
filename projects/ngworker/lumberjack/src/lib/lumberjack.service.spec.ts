import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { LumberjackService } from './lumberjack.service';

describe('LumberjackService', () => {
  let spectator: SpectatorService<LumberjackService>;
  const createService = createServiceFactory(LumberjackService);

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
