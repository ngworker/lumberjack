import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LumberjackLog, LumberjackModule, LumberjackOptions } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';

const cypressLumberjackOptions: LumberjackOptions = {
  format({ level, message, scope }: LumberjackLog): string {
    const scopeLog = scope ? ` [${scope}]` : '';

    // We leave out the `createdAt` timestamp to avoid having to construct
    // timestamps in end-to-end tests
    return `${level}${scopeLog} ${message}`;
  },
};

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    LumberjackModule.forRoot('Cypress' in window ? cypressLumberjackOptions : undefined),
    LumberjackConsoleDriverModule.forRoot(),
  ],
})
export class AppModule {}
