import { expectNgModuleToBeGuardedAgainstDirectImport } from '../angular/expect-ng-module-to-be-guarded-against-direct-import';

import { ObjectDriverModule } from './object-driver.module';

describe(ObjectDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuardedAgainstDirectImport(ObjectDriverModule);
  });
});
