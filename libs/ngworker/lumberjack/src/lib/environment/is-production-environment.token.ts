import { InjectionToken, isDevMode } from '@angular/core';

export const isProductionEnvironmentToken = new InjectionToken<boolean>('__PRODUCTION_MODE_DETECTION__', {
  factory: () => !isDevMode(),
  providedIn: 'root',
});
