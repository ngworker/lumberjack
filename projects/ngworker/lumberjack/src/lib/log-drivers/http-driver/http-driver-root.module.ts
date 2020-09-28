import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

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
export class HttpDriverRootModule {}
