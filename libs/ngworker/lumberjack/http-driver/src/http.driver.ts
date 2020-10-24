import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LumberjackLogLevel, StringLogDriver } from '@ngworker/lumberjack';

import { HttpDriverConfig, HttpDriverConfigToken } from './http-driver-config.token';

interface HttpLogEntry {
  logEntry: string;
  level: LumberjackLogLevel;
}

interface HttpLogPackage {
  logWagon: HttpLogEntry[];
  origin: string;
}

@Injectable()
export class HttpDriver implements StringLogDriver {
  logWagon: HttpLogEntry[] = [];

  constructor(
    private http: HttpClient,
    @Inject(HttpDriverConfigToken) public config: HttpDriverConfig,
    private ngZone: NgZone
  ) {}

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
    const { logWagonSize } = this.config;

    this.logWagon.push({ logEntry, level: logLevel });

    if (this.logWagon.length >= logWagonSize) {
      this.sendLogPackage()
        .pipe(tap(() => (this.logWagon = [])))
        .subscribe();
    }
  }

  private sendLogPackage(): Observable<void> {
    const { origin, storeUrl } = this.config;
    const logPackage: HttpLogPackage = { logWagon: this.logWagon, origin };

    const logPackageSent = new Subject<void>();
    const logPackageSent$ = logPackageSent.asObservable();

    this.ngZone.runOutsideAngular(() => {
      this.http
        .post<void>(storeUrl, logPackage)
        .pipe(
          tap(() => {
            logPackageSent.next();
            logPackageSent.complete();
          })
        )
        .subscribe();
    });

    return logPackageSent$;
  }
}
