import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LumberjackLevel, LumberjackModule } from '@ngworker/lumberjack';
import { LumberjackConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { HttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    LumberjackModule.forRoot(),
    LumberjackConsoleDriverModule.forRoot(),
    HttpDriverModule.forRoot({
      levels: [LumberjackLevel.Error],
      origin: 'ForestApp',
      storeUrl: '/api/logs',
      retryOptions: { maxRetries: 5, delayMs: 250 },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
