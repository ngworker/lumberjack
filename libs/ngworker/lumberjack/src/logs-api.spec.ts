import { LumberjackLevel, LumberjackLog, LumberjackLogConfigLevels, LumberjackLogEntryLevel } from './index';

describe('Logs API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLog', () => {
      const value: LumberjackLog | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackLogConfigLevels', () => {
      const value: LumberjackLogConfigLevels | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogLevel', () => {
      const value: LumberjackLogEntryLevel | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Enums', () => {
    it(`exposes ${LumberjackLevel}`, () => {});
  });
});
