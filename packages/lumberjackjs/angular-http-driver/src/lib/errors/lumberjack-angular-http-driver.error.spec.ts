import { LumberjackAngularHttpDriverError } from './lumberjack-http-driver.error';

describe(LumberjackAngularHttpDriverError.name, () => {
  it('has the default error message "LumberjackAngularHttpDriverError"', () => {
    const error = new LumberjackAngularHttpDriverError();

    expect(error.message).toBe('LumberjackAngularHttpDriverError');
  });

  it('accepts a custom error message', () => {
    const expectedMessage = 'The water stream has dried up';
    const error = new LumberjackAngularHttpDriverError(expectedMessage);

    expect(error.message).toBe(expectedMessage);
  });

  it('is an instance of Error', () => {
    const error = new LumberjackAngularHttpDriverError();

    expect(error).toBeInstanceOf(Error);
  });

  it('has the error name ""LumberjackAngularHttpDriverError"', () => {
    const error = new LumberjackAngularHttpDriverError();

    expect(error.name).toBe('LumberjackAngularHttpDriverError');
  });
});
