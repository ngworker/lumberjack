import { formatLogDriverError, lumberjackFormatLog, LumberjackLogFormatterResult } from './index';

describe('Formatting API', () => {
  describe('Interfaces', () => {
    it('exposes lumberjackFormatLog', () => {
      expect(lumberjackFormatLog).toBeDefined();
    });

    it('exposes formatLogDriverError', () => {
      expect(formatLogDriverError).toBeDefined();
    });

    it('exposes LumberjackLogFormatterResult', () => {
      const value: LumberjackLogFormatterResult | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
