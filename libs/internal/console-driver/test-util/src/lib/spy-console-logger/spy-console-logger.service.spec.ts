import { SpyConsoleLogger } from './spy-console-logger.service';

describe(SpyConsoleLogger.name, () => {
  beforeEach(() => {
    spy = new SpyConsoleLogger();
  });

  let spy: SpyConsoleLogger;

  it('can be passed a lot of arguments', () => {
    const hundredNumbers = Array(100)
      .fill(undefined)
      .map((_, index) => index + 1);

    spy.debug.apply(spy, hundredNumbers);

    expect(spy.debug).toHaveBeenCalledTimes(1);
    expect(spy.debug).toHaveBeenCalledWith(...hundredNumbers);
  });

  it('can reset spy tracking', () => {
    spy.debug(1);
    spy.debug(2);
    spy.error(1);
    spy.error(2);
    spy.error(3);

    expect(spy.debug).toHaveBeenCalledTimes(2);
    expect(spy.error).toHaveBeenCalledTimes(3);

    spy.reset();

    expect(spy.debug).toHaveBeenCalledTimes(0);
    expect(spy.error).toHaveBeenCalledTimes(0);
  });
});
