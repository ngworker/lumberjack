import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConsoleDriverModule, HttpDriverModule, LumberjackModule } from '@ngworker/lumberjack';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    HttpDriverModule.forRoot({
      origin: 'MyApp',
      storeUrl: '/api/logs',
      logWagonSize: 2,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
