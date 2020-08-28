import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LumberjackLogLevel } from '../../lumberjack-log-levels';
import { LogDriver } from '../log-driver';

import { HttpDriverConfig } from './http-driver.config';

interface HttpLogEntry {
  logEntry: string;
  level: LumberjackLogLevel;
}

interface HttpLogPackage {
  logWagon: HttpLogEntry[];
  origin: string;
}

export class HttpDriver implements LogDriver {
  logWagon: HttpLogEntry[] = [];

  constructor(private http: HttpClient, public config: HttpDriverConfig) {}

  logInfo(logEntry: string): Observable<void> {
    return this.log(logEntry, LumberjackLogLevel.Info);
  }

  logDebug(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Debug);
  }

  logError(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Error);
  }

  logWarning(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Warning);
  }

  private log(logEntry: string, logLevel: LumberjackLogLevel): Observable<void> {
    this.logWagon.push({ logEntry, level: logLevel });

    const { origin, storeUrl, logWagonSize } = this.config;

    if (this.logWagon.length >= logWagonSize) {
      const logPackage: HttpLogPackage = { logWagon: this.logWagon, origin };

      return this.http.post<void>(storeUrl, logPackage).pipe(tap(() => (this.logWagon = [])));
    }
  }
}
