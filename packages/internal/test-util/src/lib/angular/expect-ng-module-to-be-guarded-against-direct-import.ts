import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Assert that an NgModule is guarded against direct import.
 */
export const expectNgModuleToBeGuardedAgainstDirectImport = <TModule>(ngModuleType: Type<TModule>): void => {
  let ngModule: TModule | undefined;

  TestBed.configureTestingModule({
    imports: [ngModuleType],
  });

  expect(() => {
    ngModule = TestBed.inject(ngModuleType);
  }).toThrow();
  expect(ngModule).toBeUndefined();
};
