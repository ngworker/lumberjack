/* eslint-disable @typescript-eslint/no-explicit-any */
export function isClass(value: unknown): boolean {
  return (
    value &&
    (value as any).prototype &&
    (value as any).prototype.constructor &&
    (value as any).prototype.constructor.name === (value as any).name
  );
}
