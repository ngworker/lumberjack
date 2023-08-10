import { LumberjackDriver, LumberjackDriverLog } from './index';

describe('Drivers API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackDriver', () => {
      const value: LumberjackDriver | undefined = undefined;

      expect(value).toBeUndefined();
    });
    it('exposes LumberjackDriverLog', () => {
      const value: LumberjackDriverLog | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
