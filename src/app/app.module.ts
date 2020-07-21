import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConsoleDriverModule, LumberjackModule } from '@ngworker/lumberjack';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, LumberjackModule.forRoot(), ConsoleDriverModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
