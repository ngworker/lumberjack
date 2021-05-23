import { normalizeNewlines } from './normalize-newlines';

describe(normalizeNewlines.name, () => {
  it('replaces Windows newlines with Unix newlines', () => {
    const windowsJunk = 'Hello\r\nWorld';

    const actual = normalizeNewlines(windowsJunk);

    expect(actual).toBe('Hello\nWorld');
  });

  it('replaces macOS newlines with Unix newlines', () => {
    const macJunk = 'Hello\rWorld';

    const actual = normalizeNewlines(macJunk);

    expect(actual).toBe('Hello\nWorld');
  });

  it('passes Unix newlines through', () => {
    const unixGold = 'Hello\nWorld';

    const actual = normalizeNewlines(unixGold);

    expect(actual).toBe('Hello\nWorld');
  });
});
