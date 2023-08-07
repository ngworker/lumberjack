import { expectNgModuleToBeGuardedAgainstDuplicateRegistration } from '@internal/angular/test-util';

import { LumberjackHttpDriverRootModule } from './lumberjack-http-driver-root.module';

describe(LumberjackHttpDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', async () => {
    await expectNgModuleToBeGuardedAgainstDuplicateRegistration(LumberjackHttpDriverRootModule);
  });
});
