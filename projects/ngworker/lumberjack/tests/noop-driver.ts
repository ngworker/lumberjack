import { ClassProvider, Inject, Injectable, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { defaultLogDriverConfig, LogDriverConfig, LogDriverConfigToken } from '../src/lib/configs';
import { LogDriver, LogDriverToken } from '../src/lib/log-drivers';

@Injectable()
export class NoopDriver implements LogDriver {
  constructor(@Inject(LogDriverConfigToken) public config: LogDriverConfig) {}
  logInfo(logEntry: string): void {}
  logDebug(logEntry: string): void {}
  logError(logEntry: string): void {}
  logWarning(logEntry: string): void {}
}

const noopDriverProvider: ClassProvider = {
  provide: LogDriverToken,
  useClass: NoopDriver,
  multi: true,
};

@NgModule({
  providers: [{ provide: LogDriverConfigToken, useValue: defaultLogDriverConfig }, noopDriverProvider],
})
export class NoopDriverRootModule {
  constructor(@Optional() @SkipSelf() maybeNgModuleFromParentInjector?: NoopDriverRootModule) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'ConsoleDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}

@NgModule()
export class NoopDriverModule {
  static forRoot(): ModuleWithProviders<NoopDriverRootModule> {
    return {
      ngModule: NoopDriverRootModule,
    };
  }

  constructor() {
    throw new Error('Do not import NoopDriverModule directly. Use NoopDriverModule.forRoot.');
  }
}
