import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { LumberjackModule } from '@ngworker/lumberjack';
import { ConsoleDriverModule } from '@ngworker/lumberjack/console-driver';
import { FirebaseDriverModule } from '@ngworker/lumberjack/firebase-driver';
import { HttpDriverModule } from '@ngworker/lumberjack/http-driver';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LumberjackModule.forRoot(),
    ConsoleDriverModule.forRoot(),
    HttpDriverModule.forRoot({
      origin: 'ForestApp',
      storeUrl: '/api/logs',
      logWagonSize: 2,
    }),
    FirebaseDriverModule.forRoot({
      firebaseConfig: environment.firebase,
      origin: 'ForestApp',
      collectionName: 'forest-app-logs',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
