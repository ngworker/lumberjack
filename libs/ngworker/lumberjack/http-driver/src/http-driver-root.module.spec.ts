import { HttpDriverRootModule } from './http-driver-root.module';

describe(HttpDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new HttpDriverRootModule();

    expect(() => new HttpDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    expect(() => new HttpDriverRootModule()).not.toThrow();
  });
});
