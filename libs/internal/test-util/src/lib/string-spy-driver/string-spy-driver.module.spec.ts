import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { StringSpyDriverModule } from './string-spy-driver.module';

describe(StringSpyDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(StringSpyDriverModule);
  });
});
