import { FirebaseDriverRootModule } from './firebase-driver-root.module';

describe(FirebaseDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new FirebaseDriverRootModule();

    expect(() => new FirebaseDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    // tslint:disable-next-line: no-null-keyword
    const optionalAngularDependency = null;

    // tslint:disable-next-line: no-any
    expect(() => new FirebaseDriverRootModule(optionalAngularDependency as any)).not.toThrow();
  });
});
