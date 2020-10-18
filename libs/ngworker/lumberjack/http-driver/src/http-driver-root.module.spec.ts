import { HttpDriverRootModule } from './http-driver-root.module';

describe(HttpDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new HttpDriverRootModule();

    expect(() => new HttpDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    // tslint:disable-next-line: no-null-keyword
    const optionalAngularDependency = null;

    // tslint:disable-next-line: no-any
    expect(() => new HttpDriverRootModule(optionalAngularDependency as any)).not.toThrow();
  });
});
