import { InjectionToken } from '@angular/core';
import { FirebaseOptions } from '@angular/fire';

import { LogDriverConfig } from '@ngworker/lumberjack';

export const FirebaseDriverConfigToken: InjectionToken<FirebaseDriverConfig> = new InjectionToken(
  '__FIREBASE_DRIVER_CONFIG__'
);

export interface FirebaseDriverConfig extends LogDriverConfig {
  /**
   *
   * The identifier of the app who emitted the log.
   * This is used to organize logs on the log store.
   *
   */
  origin: string;

  /**
   *
   * The name of collection in Firestore for logs storing
   */
  collectionName: string;

  /**
   *
   * The configuration of Firebase application instance
   */
  firebaseConfig: FirebaseOptions;
}
