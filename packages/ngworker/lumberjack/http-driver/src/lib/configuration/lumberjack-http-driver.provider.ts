import { Provider } from '@angular/core';

import { lumberjackLogDriverToken } from '@ngworker/lumberjack';

import { LumberjackHttpDriver } from '../log-drivers/lumberjack-http.driver';

export const lumberjackHttpDriverProvider: Provider = {
  provide: lumberjackLogDriverToken,
  useClass: LumberjackHttpDriver,
  multi: true,
};
