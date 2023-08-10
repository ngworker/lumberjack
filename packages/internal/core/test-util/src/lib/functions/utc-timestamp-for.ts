export function utcTimestampFor(unixEpochTicks: number): string {
  return new Date(unixEpochTicks).toISOString();
}
