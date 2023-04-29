import { formatLogDriverError, lumberjackFormatLog, LumberjackLogFormatterResult } from './index';

describe('Formatting API', () => {
  describe('Interfaces', () => {
    it('exposes lumberjackFormatLog', () => {
      expect(lumberjackFormatLog).toBeUndefined();
    });

    it('exposes formatLogDriverError', () => {
      expect(formatLogDriverError).toBeUndefined();
    });

    it('exposes LumberjackLogFormatterResult', () => {
      const value: LumberjackLogFormatterResult | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
