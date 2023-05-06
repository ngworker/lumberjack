import { Injectable } from '@angular/core';

import { ObjectPayload } from './object.payload';

@Injectable({ providedIn: 'root' })
export class ObjectService {
  log(object?: ObjectPayload): boolean {
    return object?.isWorking ?? false;
  }
}
