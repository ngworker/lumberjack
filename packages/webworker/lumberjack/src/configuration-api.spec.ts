import { isFunction } from '@internal/core/test-util';

import {
  configFactory,
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  LumberjackFormatFunction,
  LumberjackLogDriverConfig,
  LumberjackOptions,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackConfig', () => {
      const value: LumberjackConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackLogDriverConfig', () => {
      const value: LumberjackLogDriverConfig | undefined = undefined;

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

  describe('Default configurations', () => {
    it('exposes defaultDevelopmentLevels', () => {
      expect(defaultDevelopmentLevels).toBeDefined();
    });

    it('exposes defaultProductionLevels', () => {
      expect(defaultProductionLevels).toBeDefined();
    });
  });

  describe('Factory Functions', () => {
    it('exposes configFactory', () => {
      const sut = configFactory;
      expect(isFunction(sut)).toBeTruthy();
    });

    it('exposes defaultProductionLevels', () => {
      expect(defaultProductionLevels).toBeDefined();
    });
  });
});
