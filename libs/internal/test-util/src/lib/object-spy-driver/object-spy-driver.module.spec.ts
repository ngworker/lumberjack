import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { ObjectSpyDriverModule } from './object-spy-driver.module';

describe(ObjectSpyDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(ObjectSpyDriverModule);
  });
});
