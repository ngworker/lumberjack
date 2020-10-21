import { TestBed } from '@angular/core/testing';

import { expectNgModuleToBeGuarded, resolveDependency } from '@internal/test-util';
import { LogDriver, LogDriverToken, LumberjackLogLevel, LumberjackModule } from '@ngworker/lumberjack';

import { FirebaseDriverConfig } from './firebase-driver.config';
import { FirebaseDriverModule } from './firebase-driver.module';
import { FirebaseDriver } from './firebase.driver';

const createFirebaseDriver = (
  {
    config,
    isLumberjackModuleImportedFirst = true,
  }: {
    config: FirebaseDriverConfig;
    isLumberjackModuleImportedFirst?: boolean;
  } = { config: { collectionName: 'TEST_MODULE', firebaseConfig: {}, origin: 'TEST_MODULE' } }
) => {
  TestBed.configureTestingModule({
    imports: [
      isLumberjackModuleImportedFirst ? LumberjackModule.forRoot() : [],
      FirebaseDriverModule.forRoot(config),
      isLumberjackModuleImportedFirst ? [] : LumberjackModule.forRoot(),
    ],
  });

  const [firebaseDriver] = (resolveDependency(LogDriverToken) as unknown) as LogDriver[];

  return firebaseDriver;
};

describe(FirebaseDriverModule.name, () => {
  it(`cannot be imported without using the ${FirebaseDriverModule.forRoot.name} method`, () => {
    expectNgModuleToBeGuarded(FirebaseDriverModule);
  });

  describe(FirebaseDriverModule.forRoot.name, () => {
    it('provides the firebase driver', () => {
      const firebaseDriver = createFirebaseDriver();

      expect(firebaseDriver).toBeInstanceOf(FirebaseDriver);
    });

    it('registers the specified log driver configuration', () => {
      const expectedConfig: FirebaseDriverConfig = {
        firebaseConfig: {},
        collectionName: 'TEST_MODULE',
        origin: 'TEST_MODULE',
      };

      const firebaseDriver = createFirebaseDriver({ config: expectedConfig });

      const actualConfig = firebaseDriver.config;
      expect(actualConfig).toEqual(expectedConfig);
    });

    it('does register the specified log driver configuration when the lumberjack module is imported after the http driver module', () => {
      const expectedConfig: FirebaseDriverConfig = {
        levels: [LumberjackLogLevel.Debug],
        firebaseConfig: {},
        collectionName: 'TEST_MODULE',
        origin: 'TEST_MODULE',
      };

      const firebase = createFirebaseDriver({
        config: expectedConfig,
        isLumberjackModuleImportedFirst: false,
      });

      const actualConfig = firebase.config;
      expect(actualConfig).toEqual(expectedConfig);
    });
  });
});
