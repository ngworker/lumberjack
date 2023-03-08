import { TestBed } from '@angular/core/testing';

import { lumberjackConsoleToken } from './lumberjack-console.token';

describe('lumberjackConsoleToken', () => {
  it('resolves to the console by default', () => {
    const actualConsoleLogger = TestBed.inject(lumberjackConsoleToken);

    expect(actualConsoleLogger).toBe(console);
  });
});
