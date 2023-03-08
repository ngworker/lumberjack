import { expectNgModuleToBeGuardedAgainstDuplicateRegistration } from '@internal/test-util';

import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';

describe(LumberjackConsoleDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', async () => {
    await expectNgModuleToBeGuardedAgainstDuplicateRegistration(LumberjackConsoleDriverRootModule);
  });
});
