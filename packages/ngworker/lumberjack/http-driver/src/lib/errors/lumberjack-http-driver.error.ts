export class LumberjackHttpDriverError extends Error {
  constructor(message = 'LumberjackHttpDriverError') {
    super(message);
    this.name = 'LumberjackHttpDriverError';

    // Non-standard V8 function for maintaining a stack trace
    const ErrorWithCaptureStackTrace = Error as unknown as Error & {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type -- V8 Error.captureStackTrace signature uses Function
      captureStackTrace?: (targetObject: object, constructorOpt?: Function) => void;
    };
    ErrorWithCaptureStackTrace.captureStackTrace?.(this, this.constructor);
  }
}
