export type ExcludeFromType<T, U> = {
  [K in Exclude<keyof T, keyof U>]: T[K];
};
