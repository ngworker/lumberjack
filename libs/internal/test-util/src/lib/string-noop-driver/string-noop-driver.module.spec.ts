import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { StringNoopDriverModule } from './string-noop-driver.module';

describe(StringNoopDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(StringNoopDriverModule);
  });
});
