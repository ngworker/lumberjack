import { isFunction } from '@internal/core/test-util';

import {
  createLumberjackConfig,
  LumberjackConfig,
  LumberjackDriverConfig,
  LumberjackFormatFunction,
  LumberjackOptions,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackConfig', () => {
      const value: LumberjackConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackDriverConfig', () => {
      const value: LumberjackDriverConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackFormatFunction', () => {
      const value: LumberjackFormatFunction | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackOptions', () => {
      const value: LumberjackOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Factory Functions', () => {
    it('exposes createLumberjackConfig', () => {
      const sut = createLumberjackConfig;
      expect(isFunction(sut)).toBeTruthy();
    });
  });
});
