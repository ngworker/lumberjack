import { ConsoleDriverRootModule } from './console-driver-root.module';

describe(ConsoleDriverRootModule.name, () => {
  it('guards against being registered in multiple injectors', () => {
    const rootInjectorInstance = new ConsoleDriverRootModule();

    expect(() => new ConsoleDriverRootModule(rootInjectorInstance)).toThrowError(/multiple injectors/);
  });
});
