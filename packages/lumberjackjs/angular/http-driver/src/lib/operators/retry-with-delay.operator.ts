import { catchError, MonoTypeOperatorFunction, pipe, retry, throwError } from 'rxjs';

import { LumberjackHttpDriverError } from '../errors/lumberjack-http-driver.error';

export const retryWithDelay = <T>(maxRetries: number, delayMs: number): MonoTypeOperatorFunction<T> =>
  pipe(
    retry<T>({ count: maxRetries, delay: delayMs }),
    catchError(() => throwError(() => new LumberjackHttpDriverError(`Failed after ${maxRetries} retries.`)))
  );
