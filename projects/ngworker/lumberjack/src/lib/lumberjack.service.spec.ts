import { defaultLogConfig } from './configs/default-log.config';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { LumberjackService } from './lumberjack.service';
import { ConsoleDriverModule } from './log-drivers';
import { LumberjackLogConfigToken } from './configs/lumberjack-log.config';

describe('LumberjackService', () => {
  let spectator: SpectatorService<LumberjackService>;
  const createService = createServiceFactory({
    service: LumberjackService,
    imports: [ConsoleDriverModule.forRoot()],
    providers: [{ provide: LumberjackLogConfigToken, useValue: defaultLogConfig }],
  });

  beforeEach(() => (spectator = createService()));

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});
