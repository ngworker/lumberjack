import { resolveDependency } from '@internal/test-util';

import { ConsoleLoggerToken } from './console-logger.token';

describe('ConsoleLoggerToken', () => {
  it('resolves to the console by default', () => {
    const actualConsoleLogger = resolveDependency(ConsoleLoggerToken);

    expect(actualConsoleLogger).toBe(console);
  });
});
