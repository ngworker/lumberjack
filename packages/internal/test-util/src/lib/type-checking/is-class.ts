export function isClass(value: unknown): boolean {
  // Intentionally cast to any to use optional chaining
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value as any)?.prototype?.constructor?.name !== undefined;
}
