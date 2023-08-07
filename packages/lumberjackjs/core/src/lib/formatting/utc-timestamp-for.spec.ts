import { utcTimestampFor } from './utc-timestamp-for';

describe(utcTimestampFor.name, () => {
  it('formats an ISO-8601 date-time string with 0 hours UTC offset and milliseconds resolution', () => {
    const expectedText = '2020-07-01T00:00:00.000Z';
    const ticks = new Date(expectedText).valueOf();

    const actualText = utcTimestampFor(ticks);

    expect(actualText).toBe(expectedText);
  });
});
