import { inject, NgModule } from '@angular/core';
import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  LumberjackLogDriverConfig,
  LumberjackOptions,
} from '@webworkers/lumberjack';

/**
 * Do not import directly. Use `LumberjackModule.forRoot`.
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
