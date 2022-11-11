import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

import { LumberjackLog, LumberjackModule, LumberjackOptions } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';

const cypressLumberjackOptions: LumberjackOptions = {
  format({ level, message, scope }: LumberjackLog): string {
    const scopeLog = scope ? ` [${scope}]` : '';

    // We leave out the `createdAt` timestamp to avoid having to construct
    // timestamps in end-to-end tests
    return `${level}${scopeLog} ${message}`;
  },
};

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom([
      BrowserModule,
      LumberjackModule.forRoot('Cypress' in window ? cypressLumberjackOptions : undefined),
      LumberjackConsoleDriverModule.forRoot(),
    ]),
  ],
});
