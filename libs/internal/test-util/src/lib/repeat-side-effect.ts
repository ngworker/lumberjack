export function repeatSideEffect(times: number, fn: () => void): void {
  new Array(times).fill(undefined).forEach(fn);
}
