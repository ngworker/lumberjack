import { isObject } from '@internal/test-util';

import {
  ConfigLevels,
  Level,
  LogLevel,
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

    it('exposes ConfigLevels', () => {
      const value: ConfigLevels = [];

      expect(value).toBeDefined();
    });

    it('exposes LumberjackLogLevel', () => {
      const value: LumberjackLogLevel | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LogLevel', () => {
      const value: LogLevel | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes Level', () => {
      const value: Level | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Enums', () => {
    it('exposes LumberjackLevel', () => {
      const sut = LumberjackLevel;

      expect(isObject(sut)).toBeTruthy();
    });
  });
});
