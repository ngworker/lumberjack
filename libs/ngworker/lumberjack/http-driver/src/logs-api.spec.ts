import { HttpLog } from './index';

describe('Logs API', () => {
  describe('Interfaces', () => {
    it('exposes HttpLog', () => {
      const value: HttpLog | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
