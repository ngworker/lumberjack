import { LumberjackRootModule } from './lumberjack-root.module';

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new LumberjackRootModule();

    expect(() => new LumberjackRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    expect(() => new LumberjackRootModule()).not.toThrow();
  });
});
