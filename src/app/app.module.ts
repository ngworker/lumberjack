import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LumberjackModule, ConsoleDriverModule } from '@ngworker/lumberjack';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, LumberjackModule.forRoot(), ConsoleDriverModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
