import { isClass } from '@internal/core/test-util';

import { LumberjackAngularHttpDriverError } from './index';

describe('Errors API', () => {
  it(`exposes ${LumberjackAngularHttpDriverError.name}`, () => {
    const sut = LumberjackAngularHttpDriverError;

    expect(isClass(sut)).toBeTruthy();
  });
});
