import { NgModule, Optional, SkipSelf } from '@angular/core';

import { lumberjackConsoleToken } from '@lumberjackjs/angular/console-driver';

import { SpyConsole } from './spy-console.service';

@NgModule({
  providers: [
    {
      deps: [[new Optional(), new SkipSelf(), SpyConsole]],
      provide: lumberjackConsoleToken,
      useFactory: (maybeExistingInstance: SpyConsole | null): SpyConsole => maybeExistingInstance ?? new SpyConsole(),
    },
  ],
})
export class SpyConsoleModule {}
