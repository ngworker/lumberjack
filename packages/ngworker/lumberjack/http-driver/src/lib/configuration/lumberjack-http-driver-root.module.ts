import { inject, NgModule } from '@angular/core';

/**
 * Do not import directly. Use `LumberjackHttpDriverModule.forRoot`.
 * @deprecated Use standalone provider function `provideLumberjackHttpDriver` instead. NgModules will be removed in Lumberjack 18.
 */
@NgModule()
export class LumberjackHttpDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(LumberjackHttpDriverRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
