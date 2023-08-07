import { inject, NgModule } from '@angular/core';

import { createErrorThrowingDriver } from '@internal/core/test-util';
import { lumberjackLogDriverToken } from '@lumberjackjs/angular';

import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useFactory: createErrorThrowingDriver,
      multi: true,
      deps: [errorThrowingDriverConfigToken],
    },
  ],
})
export class ErrorThrowingDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(ErrorThrowingDriverRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'ErrorThrowingDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
