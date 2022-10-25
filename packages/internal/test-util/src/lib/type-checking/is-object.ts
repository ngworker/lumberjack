export function isObject(value: unknown): boolean {
  return Object.prototype.toString.call(value) === Object.prototype.toString.call({});
}
