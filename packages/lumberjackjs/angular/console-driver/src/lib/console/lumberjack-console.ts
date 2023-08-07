/**
 * Browser console abstraction used by the console driver.
 */
export type LumberjackConsole = Pick<Console, 'debug' | 'error' | 'info' | 'trace' | 'warn'>;
