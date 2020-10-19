import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { NoopDriverModule } from './noop-driver.module';

describe(NoopDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(NoopDriverModule);
  });
});
