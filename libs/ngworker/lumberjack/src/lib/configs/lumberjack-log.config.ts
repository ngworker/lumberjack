import { inject, InjectionToken } from '@angular/core';

import { LumberjackLog } from '../lumberjack-log';
import { LumberjackTimeService } from '../time';

export const LumberjackLogConfigToken: InjectionToken<LumberjackLogConfig> = new InjectionToken(
  '__LUMBERJACK_LOG_CONFIG__',
  {
    factory: (): LumberjackLogConfig => {
      const time = inject(LumberjackTimeService);

      return {
        format: ({ context, createdAt: timestamp, level, message }) =>
          `${level}  ${time.utcTimestampFor(timestamp)} ${context ? `[${context}]` : ''} ${message}`,
      };
    },
  }
);

export interface LumberjackLogConfig {
  format(logEntry: LumberjackLog): string;
}
