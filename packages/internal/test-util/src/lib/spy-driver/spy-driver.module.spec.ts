import { expectNgModuleToBeGuardedAgainstDirectImport } from '../angular/expect-ng-module-to-be-guarded-against-direct-import';

import { SpyDriverModule } from './spy-driver.module';

describe(SpyDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuardedAgainstDirectImport(SpyDriverModule);
  });
});
