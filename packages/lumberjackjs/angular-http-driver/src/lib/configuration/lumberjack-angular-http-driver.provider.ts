import { Provider } from '@angular/core';

import { lumberjackDriverToken } from '@lumberjackjs/angular';

import { LumberjackAngularHttpDriver } from '../drivers/lumberjack-angular-http.driver';

export const LumberjackAngularHttpDriverProvider: Provider = {
  provide: lumberjackDriverToken,
  useClass: LumberjackAngularHttpDriver,
  multi: true,
};
