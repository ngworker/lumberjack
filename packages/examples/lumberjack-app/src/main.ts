import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { LumberjackLog, LumberjackOptions } from '@webworker/lumberjack';

import { AppComponent } from './app/app.component';

const cypressLumberjackOptions: LumberjackOptions = {
  format({ level, message, scope }: LumberjackLog): string {
    const scopeLog = scope ? ` [${scope}]` : '';

    // We leave out the `createdAt` timestamp to avoid having to construct
    // timestamps in end-to-end tests
    return `${level}${scopeLog} ${message}`;
  },
};

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      LumberjackModule.forRoot('Cypress' in window ? cypressLumberjackOptions : undefined),
      LumberjackConsoleDriverModule.forRoot(),
    ]),
  ],
});
