import { AbstractType, InjectFlags, InjectionToken, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnknownFunction = (...args: any[]) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testBedInject: UnknownFunction = (TestBed as any).inject || (TestBed as any).get;

/**
 * Resolve dependency from `TestBed`.
 *
 * Wrapper that prefers `TestBed.inject` over `TestBed.get`. Enables support for
 * Angular versions 8 and earlier.
 */
export function resolveDependency<T>(
  token: Type<T> | InjectionToken<T> | AbstractType<T>,
  notFoundValue?: T,
  flags?: InjectFlags
): T;
// eslint-disable-next-line no-redeclare
export function resolveDependency<T>(
  token: Type<T> | InjectionToken<T> | AbstractType<T>,
  notFoundValue: null,
  flags?: InjectFlags
): T | null {
  return testBedInject(token, notFoundValue, flags);
}
