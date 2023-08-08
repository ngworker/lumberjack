import { expectNgModuleToBeGuardedAgainstDuplicateRegistration } from '@internal/angular/test-util';

import { LumberjackAngularHttpDriverRootModule } from './lumberjack-angular-http-driver-root.module';

describe(LumberjackAngularHttpDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', async () => {
    await expectNgModuleToBeGuardedAgainstDuplicateRegistration(LumberjackAngularHttpDriverRootModule);
  });
});
