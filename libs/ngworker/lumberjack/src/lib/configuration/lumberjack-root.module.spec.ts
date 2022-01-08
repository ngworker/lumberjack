import { LumberjackRootModule } from './lumberjack-root.module';

const optionalAngularDependency = undefined;

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootInjectorInstance = new LumberjackRootModule(optionalAngularDependency as any);

    expect(() => new LumberjackRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => new LumberjackRootModule(optionalAngularDependency as any)).not.toThrow();
  });
});
