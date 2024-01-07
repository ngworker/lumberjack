import { inject, NgModule } from '@angular/core';

/**
 * Do not import directly. Use `LumberjackConsoleDriverModule.forRoot`.
 * @deprecated Use standalone provider function `provideLumberjackConsoleDriver` instead.
 */
@NgModule()
export class LumberjackConsoleDriverRootModule {
  readonly #maybeNgModuleFromParentInjector = inject(LumberjackConsoleDriverRootModule, {
    optional: true,
    skipSelf: true,
  });

  constructor() {
    if (this.#maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
