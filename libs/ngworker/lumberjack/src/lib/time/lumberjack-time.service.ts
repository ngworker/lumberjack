import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LumberjackTimeService {
  getUnixEpochTicks(): number {
    return Date.now();
  }

  utcTimestampFor(unixEpochTicks: number) {
    return new Date(unixEpochTicks).toISOString();
  }
}
