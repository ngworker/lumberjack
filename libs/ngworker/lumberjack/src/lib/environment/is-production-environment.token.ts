import { InjectionToken, isDevMode } from '@angular/core';

export const isProductionEnvironmentToken = new InjectionToken<boolean>('Production mode detection', {
  factory: () => !isDevMode(),
  providedIn: 'root',
});
