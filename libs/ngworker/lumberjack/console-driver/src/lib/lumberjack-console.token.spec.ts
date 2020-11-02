import { resolveDependency } from '@internal/test-util';

import { LumberjackConsoleToken } from './lumberjack-console.token';

describe('LumberjackConsoleToken', () => {
  it('resolves to the console by default', () => {
    const actualConsoleLogger = resolveDependency(LumberjackConsoleToken);

    expect(actualConsoleLogger).toBe(console);
  });
});
