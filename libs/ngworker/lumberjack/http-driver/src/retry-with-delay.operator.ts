import { concat, throwError } from 'rxjs';
import { delay, retryWhen, take } from 'rxjs/operators';

export const retryWithDelay = <T>(attempts: number, delayMs: number) =>
  retryWhen<T>((errors) =>
    concat(errors.pipe(delay(delayMs), take(attempts)), throwError(`Failed after ${attempts} retries.`))
  );
