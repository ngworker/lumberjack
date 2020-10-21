import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';

import { FirebaseDriverRootModule } from './firebase-driver-root.module';
import { FirebaseDriverConfig, FirebaseDriverConfigToken } from './firebase-driver.config';

@NgModule()
export class FirebaseDriverModule {
  static forRoot(config: FirebaseDriverConfig): ModuleWithProviders<FirebaseDriverRootModule> {
    const firebaseProviders = AngularFireModule.initializeApp(config.firebaseConfig).providers;

    return {
      ngModule: FirebaseDriverRootModule,
      providers: [
        ...(firebaseProviders || []),
        {
          provide: FirebaseDriverConfigToken,
          useValue: config,
        },
      ],
    };
  }

  constructor() {
    throw new Error('Do not import FirebaseDriverModule directly. Use HttpDriverModule.forRoot.');
  }
}
