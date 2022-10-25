import { Injectable, VERSION } from '@angular/core';
import { ScopedLumberjackLogger } from '@ngworker/lumberjack';
import { AppPayload } from './app-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger<AppPayload> {
  private readonly payload: AppPayload = {
    angularVersion: VERSION.major,
  };

  scope = 'Forest App';

  forestOnFire = this.createCriticalLogger('The forest is on fire!').withPayload(this.payload).build();

  helloForest = this.createInfoLogger('Hello, Forest!').withPayload(this.payload).build();
}
