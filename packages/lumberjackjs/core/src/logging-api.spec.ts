import { isClass, isFunction } from '@internal/core/test-util';

import {
  createCriticalLogBuilder,
  createDebugLogBuilder,
  createErrorLogBuilder,
  createInfoLogBuilder,
  createLumberjack,
  createTraceLogBuilder,
  createWarningLogBuilder,
  LumberjackLogBuilder,
} from './index';

describe('Logging API', () => {
  describe('Functions', () => {
    it(`exposes ${createCriticalLogBuilder.name}`, () => {
      const sut = createCriticalLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createErrorLogBuilder.name}`, () => {
      const sut = createErrorLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createInfoLogBuilder.name}`, () => {
      const sut = createInfoLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createDebugLogBuilder.name}`, () => {
      const sut = createDebugLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createWarningLogBuilder.name}`, () => {
      const sut = createWarningLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createTraceLogBuilder.name}`, () => {
      const sut = createTraceLogBuilder;

      expect(isFunction(sut)).toBeTruthy();
    });

    it(`exposes ${createLumberjack.name}`, () => {
      const sut = createLumberjack;

      expect(isFunction(sut)).toBeTruthy();
    });
  });

  describe('Builders', () => {
    it(`exposes ${LumberjackLogBuilder.name}`, () => {
      const sut = LumberjackLogBuilder;

      expect(isClass(sut)).toBeTruthy();
    });
  });
});
