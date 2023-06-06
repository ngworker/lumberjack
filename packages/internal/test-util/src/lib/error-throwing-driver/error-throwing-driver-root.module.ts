import { inject, NgModule } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { ErrorThrowingDriver } from './error-throwing.driver';

@NgModule({
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: ErrorThrowingDriver,
      multi: true,
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
