import { Optional, Provider, SkipSelf } from '@angular/core';

import { lumberjackConsoleToken } from '@ngworker/lumberjack/console-driver';

import { SpyConsole } from './spy-console.service';

export function provideSpyConsole(): Provider[] {
  return [
    {
      deps: [[new Optional(), new SkipSelf(), SpyConsole]],
      provide: lumberjackConsoleToken,
      useFactory: (maybeExistingInstance: SpyConsole | null): SpyConsole => maybeExistingInstance ?? new SpyConsole(),
    },
  ];
}
