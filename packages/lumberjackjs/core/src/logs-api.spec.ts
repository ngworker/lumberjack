import {
  LumberjackConfigLevels,
  LumberjackLevel,
  LumberjackLog,
  LumberjackLogLevel,
  LumberjackLogPayload,
} from './index';

describe('Logs API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackLog', () => {
      const value: LumberjackLog | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogPayload', () => {
      const value: LumberjackLogPayload | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackConfigLevels', () => {
      const value: LumberjackConfigLevels = [];

      expect(value).toBeDefined();
    });

    it('exposes LumberjackLogLevel', () => {
      const value: LumberjackLogLevel | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Enums', () => {
    it('exposes LumberjackLevel', () => {
      const sut = LumberjackLevel;

      expect(sut).toBeDefined();
    });
  });
});
