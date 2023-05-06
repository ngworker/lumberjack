import { expectNgModuleToBeGuardedAgainstDuplicateRegistration } from '@internal/angular/test-util';

import { LumberjackRootModule } from './lumberjack-root.module';

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', async () => {
    await expectNgModuleToBeGuardedAgainstDuplicateRegistration(LumberjackRootModule);
  });
});
