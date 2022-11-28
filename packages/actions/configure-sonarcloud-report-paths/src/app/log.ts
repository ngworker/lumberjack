export interface Log {
  debug(message: string): void;
  error(message: string): void;
  info(message: string): void;
  notice(message: string): void;
  warning(message: string): void;
}
