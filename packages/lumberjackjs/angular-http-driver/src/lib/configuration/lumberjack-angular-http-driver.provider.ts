import { Provider } from '@angular/core';

import { lumberjackLogDriverToken } from '@lumberjackjs/angular';

import { LumberjackAngularHttpDriver } from '../log-drivers/lumberjack-angular-http.driver';

export const LumberjackAngularHttpDriverProvider: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: LumberjackAngularHttpDriver,
  multi: true,
};
