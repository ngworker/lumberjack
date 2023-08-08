import { inject, NgModule } from '@angular/core';

/**
 * Do not import directly. Use `LumberjackAngularHttpDriverModule.forRoot`.
 */
@NgModule()
export class LumberjackAngularHttpDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(LumberjackAngularHttpDriverRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackAngularHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
