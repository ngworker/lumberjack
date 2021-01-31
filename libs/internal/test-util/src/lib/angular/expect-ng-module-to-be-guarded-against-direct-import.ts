import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { resolveDependency } from './resolve-dependency';

/**
 * Assert that an NgModule is guarded against direct import.
 */
export const expectNgModuleToBeGuardedAgainstDirectImport = <TModule>(ngModuleType: Type<TModule>) => {
  let ngModule: TModule | undefined;

  TestBed.configureTestingModule({
    imports: [ngModuleType],
  });

  expect(() => {
    ngModule = resolveDependency(ngModuleType);
  }).toThrow();
  expect(ngModule).toBeUndefined();
};
