import { NgModule } from '@angular/core';

import { LogDriverToken } from '../log-driver';

import { HttpDriver } from './http.driver';

@NgModule({
  providers: [
    {
      provide: LogDriverToken,
      useClass: HttpDriver,
      multi: true,
    },
  ],
})
export class HttpDriverRootModule {}
