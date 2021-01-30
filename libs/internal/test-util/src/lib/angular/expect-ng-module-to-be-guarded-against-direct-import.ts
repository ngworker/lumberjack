import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from './resolve-dependency';

/**
 * Assert that an NgModule is guarded against direct import.
 */
export const expectNgModuleToBeGuardedAgainstDirectImport = <TModule>(ngModuleType: Type<TModule>) => {
  TestBed.configureTestingModule({
    imports: [ngModuleType],
  });

  expect(() => {
    resolveDependency(ngModuleType);
  })
    .withContext(`${ngModuleType.name} must guard against being imported directly`)
    .toThrow();
};
