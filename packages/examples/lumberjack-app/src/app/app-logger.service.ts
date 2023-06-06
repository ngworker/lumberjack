import { Injectable, VERSION } from '@angular/core';

import { ScopedLumberjackLogger } from '@ngworker/lumberjack';

import { AppPayload } from './app-payload';

@Injectable({
  providedIn: 'root',
})
export class AppLogger extends ScopedLumberjackLogger<AppPayload> {
  readonly #payload: AppPayload = {
    angularVersion: VERSION.major,
  };

  readonly scope = 'Forest App';
  readonly forestOnFire = this.createCriticalLogger('The forest is on fire!').withPayload(this.#payload).build();
  readonly helloForest = this.createInfoLogger('Hello, Forest!').withPayload(this.#payload).build();
}
