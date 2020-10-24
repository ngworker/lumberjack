import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { ObjectNoopDriverModule } from './object-noop-driver.module';

describe(ObjectNoopDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(ObjectNoopDriverModule);
  });
});
