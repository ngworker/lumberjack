import { NgModule, NgZone, Type } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * Assert that an NgModule is guarded against being registered in multiple
 * environment injectors.
 */
export const expectNgModuleToBeGuardedAgainstDuplicateRegistration = <TModule>(
  ngModuleType: Type<TModule>
): Promise<void> => {
  @NgModule({
    imports: [ngModuleType, RouterModule.forChild([])],
  })
  class LazyTestModule {}

  expect.assertions(3);

  TestBed.configureTestingModule({
    imports: [
      ngModuleType,
      RouterTestingModule.withRoutes([
        {
          path: 'lazy',
          loadChildren: () => LazyTestModule,
        },
      ]),
    ],
  });

  const ngZone = TestBed.inject(NgZone);
  const router = TestBed.inject(Router);
  const initialNavigationSync = () =>
    ngZone.run(
      fakeAsync(() => {
        router.initialNavigation();
        tick();
      })
    );

  // The NgModule is not guarded against the first environment injector that
  // registers it
  expect(() => TestBed.inject(ngModuleType)).not.toThrow();
  expect(initialNavigationSync).not.toThrow();
  // The NgModule is guarded against being registered in multiple environment
  // injectors
  return expect(ngZone.run(() => router.navigateByUrl('/lazy'))).rejects.toThrowError(/multiple injectors/);
};
