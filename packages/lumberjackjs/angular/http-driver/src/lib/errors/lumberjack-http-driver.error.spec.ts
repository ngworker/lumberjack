import { LumberjackHttpDriverError } from './lumberjack-http-driver.error';

describe(LumberjackHttpDriverError.name, () => {
  it('has the default error message "LumberjackHttpDriverError"', () => {
    const error = new LumberjackHttpDriverError();

    expect(error.message).toBe('LumberjackHttpDriverError');
  });

  it('accepts a custom error message', () => {
    const expectedMessage = 'The water stream has dried up';
    const error = new LumberjackHttpDriverError(expectedMessage);

    expect(error.message).toBe(expectedMessage);
  });

  it('is an instance of Error', () => {
    const error = new LumberjackHttpDriverError();

    expect(error).toBeInstanceOf(Error);
  });

  it('has the error name ""LumberjackHttpDriverError"', () => {
    const error = new LumberjackHttpDriverError();

    expect(error.name).toBe('LumberjackHttpDriverError');
  });
});
