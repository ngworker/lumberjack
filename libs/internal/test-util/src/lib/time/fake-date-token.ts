import { InjectionToken } from '@angular/core';

export const fakeDateToken = new InjectionToken<Date>('__FAKE_DATE_TOKEN__', {
  factory: () => new Date('2020-02-02T02:02:02.000Z'),
});
