import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { SpyDriverModule } from './spy-driver.module';

describe(SpyDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(SpyDriverModule);
  });
});
