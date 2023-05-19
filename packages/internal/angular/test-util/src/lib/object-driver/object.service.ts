import { Injectable } from '@angular/core';

import { createObjectLogger, ObjectLogger } from '@internal/core/test-util';

@Injectable({ providedIn: 'root' })
export class ObjectService implements ObjectLogger {
  log = createObjectLogger().log;
}
