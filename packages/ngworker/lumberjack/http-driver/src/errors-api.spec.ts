import { isClass } from '@internal/angular/test-util';

import { LumberjackHttpDriverError } from './index';

describe('Errors API', () => {
  it(`exposes ${LumberjackHttpDriverError.name}`, () => {
    const sut = LumberjackHttpDriverError;

    expect(isClass(sut)).toBeTruthy();
  });
});
