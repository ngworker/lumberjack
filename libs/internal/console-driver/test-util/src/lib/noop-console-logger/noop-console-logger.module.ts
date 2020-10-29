import { NgModule, Optional, SkipSelf } from '@angular/core';

import { ConsoleLoggerToken } from '@ngworker/lumberjack/console-driver';

import { NoopConsoleLogger } from './noop-console-logger.service';

@NgModule({
  providers: [
    {
      deps: [[new Optional(), new SkipSelf(), NoopConsoleLogger]],
      provide: ConsoleLoggerToken,
      useFactory: (maybeExistingInstance: NoopConsoleLogger | null): NoopConsoleLogger =>
        maybeExistingInstance || new NoopConsoleLogger(),
    },
  ],
})
export class NoopConsoleLoggerModule {}
