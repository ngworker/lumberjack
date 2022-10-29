import { concat, delay, MonoTypeOperatorFunction, retryWhen, take, throwError } from 'rxjs';

import { LumberjackHttpDriverError } from '../errors/lumberjack-http-driver.error';

export const retryWithDelay = <T>(maxRetries: number, delayMs: number): MonoTypeOperatorFunction<T> =>
  retryWhen<T>((errors) =>
    concat(
      errors.pipe(delay(delayMs), take(maxRetries + 1)),
      throwError(() => new LumberjackHttpDriverError(`Failed after ${maxRetries} retries.`))
    )
  );
