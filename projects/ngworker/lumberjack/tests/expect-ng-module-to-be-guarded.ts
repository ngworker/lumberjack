import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from './resolve-dependency';

export const expectNgModuleToBeGuarded = <TModule>(ngModuleType: Type<TModule>) => {
  let ngModule: TModule | undefined;

  TestBed.configureTestingModule({
    imports: [ngModuleType],
  });

  expect(() => {
    ngModule = resolveDependency(ngModuleType);
  })
    .withContext(`${ngModuleType.name} must guard against being imported directly`)
    .toThrow();
};
