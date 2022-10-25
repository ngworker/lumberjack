# Internal test utilities for Lumberjack

## Buildable library

This library is buildable because Lumberjack's tests depend on it. Lumberjack is a publishable library and since buildable and publishable libraries cannot depend on non-buildable libraries, this library has to be buildable. Because of this, we have added a `build` target to this library.

The following files are related to the `build` target:

- `ng-package.json`
- `package.json`
- `project.json`
- `tsconfig.lib.prod.json`
