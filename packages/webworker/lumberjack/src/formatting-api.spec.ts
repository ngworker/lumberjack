import { isFunction } from '@internal/core/test-util';

import { createLumberjackLogFormatter, lumberjackFormatLog, LumberjackLogFormatterResult } from './index';

describe('Formatting API', () => {
  describe('Interfaces', () => {
    it('exposes lumberjackFormatLog', () => {
      expect(lumberjackFormatLog).toBeDefined();
    });

    it('exposes LumberjackLogFormatter', () => {
      const sut = createLumberjackLogFormatter;

      expect(isFunction(sut)).toBeTruthy();
    });

    it('exposes LumberjackLogFormatterResult', () => {
      const value: LumberjackLogFormatterResult | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
