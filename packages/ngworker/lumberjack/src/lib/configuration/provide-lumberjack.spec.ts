import { TestBed } from '@angular/core/testing';

import {
  defaultDevelopmentLevels,
  defaultProductionLevels,
  LumberjackConfig,
  lumberjackFormatLog,
  LumberjackLevel,
  LumberjackLogDriverConfig,
  LumberjackOptions,
} from '@webworker/lumberjack';

import { isProductionEnvironmentToken } from '../environment/is-production-environment.token';
import { LumberjackService } from '../logging/lumberjack.service';

import { lumberjackConfigToken } from './lumberjack-config.token';
import { lumberjackLogDriverConfigToken } from './lumberjack-log-driver-config.token';
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
    expect(actualConfig).toEqual({
      levels: defaultDevelopmentLevels,
      format: expect.any(Function),
    });
  });

  it('provides a default Lumberjack configuration in production mode', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack(), { provide: isProductionEnvironmentToken, useValue: true }],
    });

    const actualConfig = TestBed.inject(lumberjackConfigToken);
    expect(actualConfig).toEqual({
      format: lumberjackFormatLog,
      levels: defaultProductionLevels,
    });
  });

  it('provides a default log driver configuration', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack()],
    });
    const logConfig = TestBed.inject(lumberjackConfigToken);
    const defaultLogDriverConfig: Omit<LumberjackLogDriverConfig, 'identifier'> = {
      levels: logConfig.levels,
    };

    const actualConfig = TestBed.inject(lumberjackLogDriverConfigToken);
    expect(actualConfig).toEqual(defaultLogDriverConfig as LumberjackLogDriverConfig);
  });

  it('provides the LumberjackService', () => {
    TestBed.configureTestingModule({
      providers: [provideLumberjack()],
    });
    const lumberjackService = TestBed.inject(LumberjackService);

    expect(lumberjackService).toBeDefined();
  });
});
