import { expectNgModuleToBeGuardedAgainstDirectImport } from '../angular/expect-ng-module-to-be-guarded-against-direct-import';

import { ErrorThrowingDriverModule } from './error-throwing-driver.module';

describe(ErrorThrowingDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuardedAgainstDirectImport(ErrorThrowingDriverModule);
  });
});
