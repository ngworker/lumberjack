import { isClass, isFunction } from '@internal/core/test-util';

import { createLumberjack, createLumberjackLogFactory, LumberjackLogBuilder } from './index';

describe('Logging API', () => {
  describe('Functions', () => {
    it(`exposes ${createLumberjackLogFactory.name}`, () => {
      const sut = createLumberjackLogFactory;

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
