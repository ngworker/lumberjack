import { expectNgModuleToBeGuardedAgainstDirectImport } from '../angular/expect-ng-module-to-be-guarded-against-direct-import';

import { NoopDriverModule } from './noop-driver.module';

describe(NoopDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuardedAgainstDirectImport(NoopDriverModule);
  });
});
