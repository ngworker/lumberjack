import { ModuleWithProviders, NgModule } from '@angular/core';

import { defaultErrorThrowingDriverConfig } from './default-error-throwing-driver-config';
import { errorThrowingDriverConfigToken } from './error-throwing-driver-config.token';
import { ErrorThrowingDriverRootModule } from './error-throwing-driver-root.module';
import { ErrorThrowingDriverConfig } from './error-throwing-driver.config';

/**
 * Service module for `ErrorThrowingDriver`.
 *
 * Use `ErrorThrowingDriverModule.forRoot` to import.
 */
@NgModule()
export class ErrorThrowingDriverModule {
  static forRoot(config?: Partial<ErrorThrowingDriverConfig>): ModuleWithProviders<ErrorThrowingDriverRootModule> {
    return {
      ngModule: ErrorThrowingDriverRootModule,
      providers: [{ provide: errorThrowingDriverConfigToken, useValue: config || defaultErrorThrowingDriverConfig }],
    };
  }

  constructor() {
    throw new Error('Do not import ErrorThrowingDriverModule directly. Use ErrorThrowingDriverModule.forRoot.');
  }
}
