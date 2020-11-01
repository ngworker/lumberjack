import { concat, throwError } from 'rxjs';
import { delay, retryWhen, take } from 'rxjs/operators';

export const retryWithDelay = <T>(attempts: number, delayMs: number) =>
  retryWhen<T>((errors) =>
    concat(errors.pipe(delay(delayMs), take(attempts - 1)), throwError(`Failed after ${attempts} attempts.`))
  );
