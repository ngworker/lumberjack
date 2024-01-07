import { inject, NgModule } from '@angular/core';

/**
 * Do not import directly. Use `LumberjackModule.forRoot`.
 *
 * @deprecated Use standalone provider function `provideLumberjack` instead. NgModules will be removed in Lumberjack 18.
 */
@NgModule()
export class LumberjackRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(LumberjackRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
