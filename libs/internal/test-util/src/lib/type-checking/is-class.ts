export function isClass(value: unknown): boolean {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    value &&
    (value as any).prototype &&
    (value as any).prototype.constructor &&
    (value as any).prototype.constructor.name === (value as any).name
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
