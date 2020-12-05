import { LumberjackHttpDriverRootModule } from './lumberjack-http-driver-root.module';

describe(LumberjackHttpDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new LumberjackHttpDriverRootModule();

    expect(() => new LumberjackHttpDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });

  it('does not guard the first injector that registers it', () => {
    expect(() => new LumberjackHttpDriverRootModule()).not.toThrow();
  });
});
