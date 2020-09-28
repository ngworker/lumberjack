import { NgModule } from '@angular/core';

import { LogDriverToken } from '../log-driver';

import { ConsoleDriver } from './console.driver';

@NgModule({
  providers: [
    {
      provide: LogDriverToken,
      useClass: ConsoleDriver,
      multi: true,
    },
  ],
})
export class ConsoleDriverRootModule {}
