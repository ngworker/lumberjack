import { NgModule, Optional, SkipSelf } from '@angular/core';

import { LumberjackConsoleToken } from '@ngworker/lumberjack/console-driver';

import { SpyConsole } from './spy-console.service';

@NgModule({
  providers: [
    {
      deps: [[new Optional(), new SkipSelf(), SpyConsole]],
      provide: LumberjackConsoleToken,
      useFactory: (maybeExistingInstance: SpyConsole | null): SpyConsole => maybeExistingInstance || new SpyConsole(),
    },
  ],
})
export class SpyConsoleModule {}
