import { LumberjackConsoleDriverRootModule } from './lumberjack-console-driver-root.module';

describe(LumberjackConsoleDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new LumberjackConsoleDriverRootModule();

    expect(() => new LumberjackConsoleDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    expect(() => new LumberjackConsoleDriverRootModule()).not.toThrow();
  });
});
