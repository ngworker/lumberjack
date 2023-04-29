import { LumberjackLogDriver, LumberjackLogDriverError, LumberjackLogDriverLog } from './index';

describe('Log drivers API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLogDriver', () => {
      const value: LumberjackLogDriver | undefined = undefined;

      expect(value).toBeUndefined();
    });
    it('exposes LumberjackLogDriverLog', () => {
      const value: LumberjackLogDriverLog | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogDriverError', () => {
      const value: LumberjackLogDriverError | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
