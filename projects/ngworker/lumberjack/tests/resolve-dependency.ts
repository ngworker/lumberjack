import { AbstractType, InjectFlags, InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

const inject: Function = (TestBed as any).inject || (TestBed as any).get;

export function resolveDependency<T>(
  token: Type<T> | InjectionToken<T> | AbstractType<T>,
  notFoundValue?: T,
  flags?: InjectFlags
): T;
export function resolveDependency<T>(
  token: Type<T> | InjectionToken<T> | AbstractType<T>,
  // tslint:disable-next-line: no-null-keyword
  notFoundValue: null,
  flags?: InjectFlags
): T | null {
  return inject(token, notFoundValue, flags);
}
