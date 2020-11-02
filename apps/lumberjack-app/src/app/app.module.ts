import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';
import { ConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { HttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    HttpDriverModule.forRoot({
      levels: [LumberjackLogLevel.Error],
      origin: 'ForestApp',
      storeUrl: '/api/logs',
      retryOptions: { attempts: 5, delayMs: 250 },
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
