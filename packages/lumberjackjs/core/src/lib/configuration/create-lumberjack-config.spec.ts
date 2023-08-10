import { createFakeTime } from '@internal/core/test-util';

import { lumberjackFormatLog } from '../formatting/lumberjack-format-log';
import { createDebugLogBuilder } from '../logging/create-lumberjack-log-builder-functions/create-debug-log-builder';
import { LumberjackLog } from '../logs/lumberjack.log';

import { createLumberjackConfig } from './create-lumberjack-config';
import { defaultDevelopmentLevels } from './default-development-levels';
import { defaultProductionLevels } from './default-production-levels';
import { LumberjackConfig } from './lumberjack.config';
import { LumberjackOptions } from './lumberjack.options';

const fakeFormattedMessage = 'fake-formatted-message';

describe(createLumberjackConfig.name, () => {
  let mockOptions: LumberjackOptions;
  let mockDebugLog: LumberjackLog;

  const fakeTime = createFakeTime();

  beforeEach(() => {
    mockOptions = {
      format: () => fakeFormattedMessage,
    };
    mockDebugLog = createDebugLogBuilder(fakeTime.getUnixEpochTicks.bind(fakeTime))('fake-message').build();
  });

  test('should create a development environment configuration when isProductionEnvironment is false', () => {
    const config: LumberjackConfig = createLumberjackConfig(false, mockOptions);

    expect(config.format).toBeInstanceOf(Function);
    expect(config.format(mockDebugLog)).toBe(fakeFormattedMessage);
    expect(config.levels).toBe(defaultDevelopmentLevels);
    expect(config).toMatchObject(mockOptions);
  });

  test('should create a production environment configuration when isProductionEnvironment is true', () => {
    const config: LumberjackConfig = createLumberjackConfig(true, mockOptions);

    expect(config.format).toBeInstanceOf(Function);
    expect(config.format(mockDebugLog)).toBe(fakeFormattedMessage);
    expect(config.levels).toBe(defaultProductionLevels);
    expect(config).toMatchObject(mockOptions);
  });

  test('should handle default options correctly', () => {
    const config: LumberjackConfig = createLumberjackConfig(true);

    expect(config.format).toBeInstanceOf(Function);
    expect(config.format(mockDebugLog)).toBe(lumberjackFormatLog(mockDebugLog));
    expect(config.levels).toBe(defaultProductionLevels);
    expect(config).toMatchObject({});
  });
});
