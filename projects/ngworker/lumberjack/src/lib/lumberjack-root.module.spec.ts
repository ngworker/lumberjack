import { LumberjackRootModule } from './lumberjack-root.module';

describe(LumberjackRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new LumberjackRootModule();

    expect(() => new LumberjackRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });
});
