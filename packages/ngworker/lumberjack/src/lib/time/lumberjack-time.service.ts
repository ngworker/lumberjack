import { Injectable } from '@angular/core';

/**
 * Used by Lumberjack to timestamp logs at their creation time.
 *
 * Can be overriden for testing purposes.
 */
@Injectable({
  providedIn: 'root',
})
export class LumberjackTimeService {
  /**
   * Return the current date-time as Unix epoch ticks in milliseconds.
   */
  getUnixEpochTicks(): number {
    return Date.now();
  }
}
