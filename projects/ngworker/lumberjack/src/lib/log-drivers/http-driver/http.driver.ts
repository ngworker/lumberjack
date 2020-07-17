import { HttpClient } from '@angular/common/http';
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

  logInfo(logEntry: string): void {
    this.log(logEntry, LumberjackLogLevel.Info);
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

  private log(logEntry: string, logLevel: LumberjackLogLevel): void {
    this.logWagon.push({ logEntry, level: logLevel });

    const { origin, storeUrl, logWagonSize } = this.config;

    if (this.logWagon.length >= logWagonSize) {
      const logPackage: HttpLogPackage = { logWagon: this.logWagon, origin };

      this.http.post(storeUrl, logPackage).subscribe({
        next: () => {
          // clear the wagon on success
          this.logWagon = [];
        },
      });
    }
  }
}
