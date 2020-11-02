/**
 * Call the function the specified number of times.
 */
export function repeatFunctionCalls(times: number, fn: () => void): void {
  new Array(times).fill(undefined).forEach(fn);
}
