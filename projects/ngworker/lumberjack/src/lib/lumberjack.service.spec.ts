import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { defaultLogConfig } from './configs/default-log.config';
import { LumberjackLogConfigToken } from './configs/lumberjack-log.config';
import { ConsoleDriverModule } from './log-drivers';
import { LumberjackService } from './lumberjack.service';

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
