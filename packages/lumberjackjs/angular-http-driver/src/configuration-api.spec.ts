import { isClass } from '@internal/core/test-util';

import {
  LumberjackAngularHttpDriverConfig,
  LumberjackAngularHttpDriverModule,
  LumberjackAngularHttpDriverOptions,
  LumberjackAngularHttpDriverRetryOptions,
  LumberjackAngularHttpDriverRootModule,
  provideLumberjackAngularHttpDriver,
  withHttpConfig,
  withHttpOptions,
} from './index';

describe('Configuration API', () => {
  describe('Interfaces', () => {
    it('exposes LumberjackAngularHttpDriverConfig', () => {
      const value: LumberjackAngularHttpDriverConfig | undefined = undefined;

      expect(value).toBeUndefined();
    });

    it('exposes LumberjackAngularHttpDriverRetryOptions', () => {
      const value: LumberjackAngularHttpDriverRetryOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Types', () => {
    it('exposes LumberjackAngularHttpDriverOptions', () => {
      const value: LumberjackAngularHttpDriverOptions | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });

  describe('Angular modules', () => {
    it(`exposes ${LumberjackAngularHttpDriverModule.name}`, () => {
      const sut = LumberjackAngularHttpDriverModule;

      expect(isClass(sut)).toBeTruthy();
    });

    it(`exposes ${LumberjackAngularHttpDriverRootModule.name}`, () => {
      const sut = LumberjackAngularHttpDriverRootModule;

      expect(isClass(sut)).toBeTruthy();
    });
  });

  describe('Providers functions', () => {
    it('exposes provideLumberjackAngularHttpDriver and its configurations', () => {
      const value: typeof provideLumberjackAngularHttpDriver | undefined = undefined;
      const config: typeof withHttpConfig | undefined = undefined;
      const options: typeof withHttpOptions | undefined = undefined;

      expect(value).toBeUndefined();
      expect(config).toBeUndefined();
      expect(options).toBeUndefined();
    });
  });
});
