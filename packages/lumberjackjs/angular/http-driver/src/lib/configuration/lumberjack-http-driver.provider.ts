import { Provider } from '@angular/core';

import { lumberjackLogDriverToken } from '@lumberjackjs/angular';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

export const lumberjackHttpDriverProvider: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: LumberjackHttpDriver,
  multi: true,
};
