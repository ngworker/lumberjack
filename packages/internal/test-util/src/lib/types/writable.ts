export type Writable<TObject> = {
  -readonly [Key in keyof TObject]: TObject[Key];
} & Record<string, unknown>;
