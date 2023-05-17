export function createFakeTime() {
  let now = new Date();

  function getUnixEpochTicks(): number {
    return now.valueOf();
  }

  function setTime(fakeNow: Date): void {
    now = fakeNow;
  }

  return {
    getUnixEpochTicks,
    setTime,
  };
}
