import { LumberjackRootModule } from './lumberjack-root.module';

// tslint:disable-next-line: no-null-keyword
const optionalAngularDependency = null;

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    // tslint:disable-next-line: no-any
    const rootInjectorInstance = new LumberjackRootModule(optionalAngularDependency as any);

    expect(() => new LumberjackRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    // tslint:disable-next-line: no-any
    expect(() => new LumberjackRootModule(optionalAngularDependency as any)).not.toThrow();
  });
});
