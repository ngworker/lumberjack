import { Inject, Injectable, NgZone } from '@angular/core';
// tslint:disable-next-line:no-submodule-imports
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';

import { LogDriver, LumberjackLogLevel } from '@ngworker/lumberjack';

import { FirebaseDriverConfig, FirebaseDriverConfigToken } from './firebase-driver.config';

interface FirestoreCollectionItem {
  entry: string;
  level: LumberjackLogLevel;
  origin: string;
}

@Injectable()
export class FirebaseDriver implements LogDriver {
  constructor(
    private firestore: AngularFirestore,
    @Inject(FirebaseDriverConfigToken) public config: FirebaseDriverConfig,
    private ngZone: NgZone
  ) {}

  logInfo(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Info);
  }

  logDebug(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Debug);
  }

  logError(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Error);
  }

  logWarning(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Warning);
  }

  private log(entry: string, level: LumberjackLogLevel): void {
    const { origin } = this.config;
    this.sendLogPackage({ entry, level, origin }).catch((error) =>
      console.error('Package has not been successfully sent.', { error })
    );
  }

  private sendLogPackage(collectionItem: FirestoreCollectionItem): Promise<DocumentReference> {
    return new Promise<DocumentReference>((resolve, reject) => {
      this.ngZone.runOutsideAngular(() => {
        this.firestore.collection(this.config.collectionName).add(collectionItem).then(resolve).catch(reject);
      });
    });
  }
}
