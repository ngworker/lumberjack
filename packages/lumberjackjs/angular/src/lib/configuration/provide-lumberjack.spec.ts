import { TestBed } from '@angular/core/testing';

import { defaultDevelopmentLevels, defaultProductionLevels } from '@internal/core/test-util';
import { LumberjackConfig, LumberjackDriverConfig, LumberjackLevel, LumberjackOptions } from '@lumberjackjs/core';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { LumberjackService } from '../logging/lumberjack.service';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackDriverConfigToken } from './lumberjack-driver-config.token';
import { provideLumberjack } from './provide-lumberjack';

describe(provideLumberjack.name, () => {
  it('accepts a Lumberjack configuration', () => {
    const expectedConfig: LumberjackConfig = {
      format: ({ message }) => message,
      levels: [LumberjackLevel.Debug],
    };

    TestBed.configureTestingModule({
      providers: [provideLumberjack(expectedConfig)],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig).toEqual(expectedConfig);
  });

  it('accepts Lumberjack options in development mode', () => {
    const config: LumberjackOptions = {
      format: ({ message }) => message,
    };
    const expectedConfig: LumberjackOptions = {
      ...config,
      levels: defaultDevelopmentLevels,
    };

    TestBed.configureTestingModule({
      providers: [provideLumberjack(config), { provide: isProductionEnvironmentToken, useValue: false }],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig).toEqual(expectedConfig as LumberjackConfig);
  });

  it('accepts Lumberjack options in production mode', () => {
    const config: LumberjackOptions = {
      format: ({ message }) => message,
    };
    const expectedConfig: LumberjackOptions = {
      ...config,
      levels: defaultProductionLevels,
    };

    TestBed.configureTestingModule({
      providers: [provideLumberjack(config), { provide: isProductionEnvironmentToken, useValue: true }],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig).toEqual(expectedConfig as LumberjackConfig);
  });

  it('provides a default Lumberjack configuration in development mode', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), { provide: isProductionEnvironmentToken, useValue: false }],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig.levels).toEqual(defaultDevelopmentLevels);
  });

  it('provides a default Lumberjack configuration in production mode', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), { provide: isProductionEnvironmentToken, useValue: true }],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig.levels).toEqual(defaultProductionLevels);
  });

  it('provides a default driver configuration', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack()],
    });
    const logConfig = TestBed.inject(lumberjackConfigToken);
    const defaultDriverConfig: Omit<LumberjackDriverConfig, 'identifier'> = {
      levels: logConfig.levels,
    };

    const actualConfig = TestBed.inject(lumberjackDriverConfigToken);
    expect(actualConfig).toEqual(defaultDriverConfig as LumberjackDriverConfig);
  });

  it('provides the LumberjackService', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack()],
    });
    const lumberjackService = TestBed.inject(LumberjackService);

    expect(lumberjackService).toBeDefined();
  });
});
