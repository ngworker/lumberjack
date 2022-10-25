import { LumberjackRootModule } from './lumberjack-root.module';

const optionalAngularDependency = undefined;

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    // @ts-expect-error - Intentionally emulate an optional dependency being injected
    const rootInjectorInstance = new LumberjackRootModule(optionalAngularDependency);

    expect(() => new LumberjackRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    // @ts-expect-error - Intentionally emulate an optional dependency being injected
    expect(() => new LumberjackRootModule(optionalAngularDependency)).not.toThrow();
  });
});
