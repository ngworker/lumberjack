import { Optional, SkipSelf } from '@angular/core';

import { lumberjackConsoleToken } from '@ngworker/lumberjack/console-driver';

import { NoopConsole } from './noop-console.service';

export function provideNoopConsole() {
  return [
    {
      deps: [[new Optional(), new SkipSelf(), NoopConsole]],
      provide: lumberjackConsoleToken,
      useFactory: (maybeExistingInstance: NoopConsole | null): NoopConsole =>
        maybeExistingInstance ?? new NoopConsole(),
    },
  ];
}
