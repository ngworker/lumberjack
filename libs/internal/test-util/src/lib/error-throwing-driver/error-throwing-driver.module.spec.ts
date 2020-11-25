import { expectNgModuleToBeGuarded } from '../expect-ng-module-to-be-guarded';

import { ErrorThrowingDriverModule } from './error-throwing-driver.module';

describe(ErrorThrowingDriverModule.name, () => {
  it('is guarded against direct import', () => {
    expectNgModuleToBeGuarded(ErrorThrowingDriverModule);
  });
});
