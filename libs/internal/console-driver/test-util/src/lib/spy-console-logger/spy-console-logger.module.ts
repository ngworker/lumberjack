import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ConsoleLoggerToken } from '@ngworker/lumberjack/console-driver';

import { SpyConsoleLogger } from './spy-console-logger.service';

@NgModule({
  providers: [
    {
      deps: [[new Optional(), new SkipSelf(), SpyConsoleLogger]],
      provide: ConsoleLoggerToken,
      useFactory: (maybeExistingInstance: SpyConsoleLogger | null): SpyConsoleLogger =>
        maybeExistingInstance || new SpyConsoleLogger(),
    },
  ],
})
export class SpyConsoleLoggerModule {}
