import { Inject, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
// tslint:disable-next-line:no-submodule-imports
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import { LogDriverConfig, LogDriverConfigToken, LogDriverToken } from '@ngworker/lumberjack';

import { FirebaseDriverConfig, FirebaseDriverConfigToken } from './firebase-driver.config';
import { FirebaseDriver } from './firebase.driver';

export function firebaseDriverFactory(
  firestore: AngularFirestore,
  logDriverConfig: LogDriverConfig,
  firebaseDriverConfig: FirebaseDriverConfig,
  ngZone: NgZone
): FirebaseDriver {
  const config: FirebaseDriverConfig = {
    ...logDriverConfig,
    ...firebaseDriverConfig,
  };

  return new FirebaseDriver(firestore, config, ngZone);
}

@NgModule({
  imports: [AngularFirestoreModule],
  providers: [
    {
      deps: [AngularFirestore, LogDriverConfigToken, FirebaseDriverConfigToken, NgZone],
      multi: true,
      provide: LogDriverToken,
      useFactory: firebaseDriverFactory,
    },
  ],
})
export class FirebaseDriverRootModule {
  constructor(
    @Optional() @SkipSelf() @Inject(FirebaseDriverRootModule) maybeNgModuleFromParentInjector?: FirebaseDriverRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'FirebaseDriverModule.forRoot registered in multiple injectors. Only call it from your root injector such as in AppModule.'
      );
    }
  }
}
