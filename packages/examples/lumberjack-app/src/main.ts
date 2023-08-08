import { withInterceptors } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { provideLumberjack } from '@lumberjackjs/angular';
import { provideLumberjackConsoleDriver } from '@lumberjackjs/angular/console-driver';
import { provideLumberjackAngularHttpDriver, withHttpOptions } from '@lumberjackjs/angular/http-driver';
import { LumberjackLog, LumberjackOptions } from '@lumberjackjs/core';

import { AppComponent } from './app/app.component';

const cypressLumberjackOptions: LumberjackOptions = {
  format({ level, message, scope }: LumberjackLog): string {
    const scopeLog = scope ? ` [${scope}]` : '';

    // We leave out the `createdAt` timestamp to avoid having to construct
    // timestamps in end-to-end tests
    return `${level}${scopeLog} ${message}`;
  },
};

const easyToken = new InjectionToken('easy-provider');

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: easyToken,
      useValue: 'provider-easy',
    },
    provideLumberjack('Cypress' in window ? cypressLumberjackOptions : undefined),
    provideLumberjackConsoleDriver(),
    provideLumberjackAngularHttpDriver(
      withHttpOptions({
        origin: 'ForestApp',
        retryOptions: { maxRetries: 1, delayMs: 250 },
        storeUrl: '/api/logs',
      }),
      withInterceptors([
        (req, next) => {
          const easy = inject(easyToken);
          console.log('are interceptors working?', easy);
          return next(req);
        },
      ])
    ),
  ],
}).catch((err: unknown) => console.error(err));
