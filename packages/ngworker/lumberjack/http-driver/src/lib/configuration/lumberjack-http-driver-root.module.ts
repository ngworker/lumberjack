import { HttpClientModule } from '@angular/common/http';
import { Inject, NgModule, Optional, SkipSelf } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

/**
 * Do not import directly. Use `LumberjackHttpDriverModule.forRoot`.
 */
@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: lumberjackLogDriverToken,
      useClass: LumberjackHttpDriver,
      multi: true,
    },
  ],
})
export class LumberjackHttpDriverRootModule {
  constructor(
    @Optional()
    @SkipSelf()
    @Inject(LumberjackHttpDriverRootModule)
    private maybeNgModuleFromParentInjector: LumberjackHttpDriverRootModule | undefined | null = null
  ) {
    if (this.maybeNgModuleFromParentInjector) {
      throw new Error(
        'LumberjackHttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
