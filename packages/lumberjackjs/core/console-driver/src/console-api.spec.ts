import { LumberjackConsole } from './index';

describe('Console API', () => {
  describe('Types', () => {
    it('exposes LumberjackConsole', () => {
      const value: LumberjackConsole | undefined = undefined;

      expect(value).toBeUndefined();
    });
  });
});
