import { concat, throwError } from 'rxjs';
import { delay, retryWhen, take } from 'rxjs/operators';

export const retryWithDelay = <T>(maxRetries: number, delayMs: number) =>
  retryWhen<T>((errors) =>
    concat(errors.pipe(delay(delayMs), take(maxRetries + 1)), throwError(`Failed after ${maxRetries} retries.`))
  );
