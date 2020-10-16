import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export const expectNgModuleToBeGuarded = <TModule>(ngModuleType: Type<TModule>) => {
  let ngModule: TModule | undefined;

  TestBed.configureTestingModule({
    imports: [ngModuleType],
  });

  expect(() => {
    ngModule = TestBed.get(ngModuleType);
  })
    .withContext(`${ngModuleType.name} must guard against being imported directly`)
    .toThrow();
};
