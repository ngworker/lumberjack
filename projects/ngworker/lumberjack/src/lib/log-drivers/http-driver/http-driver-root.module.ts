import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LogDriverToken } from '../log-driver';

import { HttpDriver } from './http.driver';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: LogDriverToken,
      useClass: HttpDriver,
      multi: true,
    },
  ],
})
export class HttpDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: HttpDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'HttpDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
