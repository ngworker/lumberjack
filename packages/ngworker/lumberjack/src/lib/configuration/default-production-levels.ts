import { ConfigLevels, LumberjackConfigLevels } from '../logs/lumberjack-config-levels';

export const defaultProductionLevels: LumberjackConfigLevels | ConfigLevels = ['critical', 'error', 'info', 'warn'];
