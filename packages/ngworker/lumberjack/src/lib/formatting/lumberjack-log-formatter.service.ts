import { inject, Injectable } from '@angular/core';

import {
  createLumberjackLogFormatter,
  LumberjackConfig,
  LumberjackLog,
  LumberjackLogFormatter,
  LumberjackLogFormatterResult,
  LumberjackLogPayload,
} from '@webworker/lumberjack';

import { lumberjackConfigToken } from '../configuration/lumberjack-config.token';
import { LumberjackTimeService } from '../time/lumberjack-time.service';

@Injectable()
export class LumberjackLogFormatterService<TPayload extends LumberjackLogPayload | void = void>
  implements LumberjackLogFormatter<TPayload>
{
  readonly #config = inject<LumberjackConfig<TPayload>>(lumberjackConfigToken);
  readonly #time = inject(LumberjackTimeService);

  readonly #lumberjackLogFormatter = createLumberjackLogFormatter<TPayload>({
    config: this.#config,
    getUnixEpochTicks: this.#time.getUnixEpochTicks.bind(this.time),
  });

  formatLog(log: LumberjackLog<TPayload>): LumberjackLogFormatterResult<TPayload> {
    return this.#lumberjackLogFormatter.formatLog(log);
  }
}
