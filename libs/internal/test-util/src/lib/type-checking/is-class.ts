export function isClass(value: unknown): boolean {
  // tslint:disable: no-any
  return (
    value &&
    (value as any).prototype &&
    (value as any).prototype.constructor &&
    (value as any).prototype.constructor.name === (value as any).name
  );
  // tslint:enable: no-any
}
