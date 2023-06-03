/*
 * Public API surface of @internal/test-util
 */

// Angular
export * from './lib/angular/expect-ng-module-to-be-guarded-against-direct-import';
export * from './lib/angular/expect-ng-module-to-be-guarded-against-duplicate-registration';

// Error-throwing driver
export * from './lib/error-throwing-driver/error-throwing-driver.module';
export * from './lib/error-throwing-driver/error-throwing-driver-root.module';

// No-op driver
export * from './lib/noop-driver/noop-driver.module';
export * from './lib/noop-driver/noop-driver-root.module';

// Spy driver
export * from './lib/spy-driver/spy-driver.module';
export * from './lib/spy-driver/spy-driver-root.module';

// Object driver
export * from './lib/object-driver/object-driver.module';
export * from './lib/object-driver/object-driver-root.module';
export * from './lib/object-driver/object.service';

// Time
export * from './lib/time/fake-time.service';
