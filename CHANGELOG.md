# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/ngworker/lumberjack/compare/v2.0.0...v2.0.1) (2021-02-12)

### Documentation

- Review readme
- List Angular 11.2.x compatibility

## [2.0.0](https://github.com/ngworker/lumberjack/compare/v2.0.0-rc.1...v2.0.0) (2021-02-04)

### Features

- add ng-add schematic ([#70](https://github.com/ngworker/lumberjack/issues/70)) ([219c6da](https://github.com/ngworker/lumberjack/commit/219c6daab024763c54f65cdb42dd4e8bb574a2d6))

## [2.0.0-rc.1](https://github.com/ngworker/lumberjack/compare/v2.0.0-rc.0...v2.0.0-rc.1) (2021-01-30)

### Features

- add LumberjackLogFactory ([#64](https://github.com/ngworker/lumberjack/issues/64)) ([938c2d6](https://github.com/ngworker/lumberjack/commit/938c2d6ab1ce7e3c81a5bd2dd085da7c9a6775d8))

## [2.0.0-rc.0](https://github.com/ngworker/lumberjack/compare/v1.0.8...v2.0.0-rc.0) (2021-01-19)

### ⚠ BREAKING CHANGES

- driver authors need to implement the new interface

- LumberjackLog property context was renamed to scope

- Interfaces exposed in version 1 now have properties with readonly access.

- LumberjackLogLevel is renamed to LumberjackLevel.

- LumberjackLogEntryLevel is renamed to LumberjackLogLevel.

- LumberjackLogConfigLevels is renamed to LumberjackConfigLevels

- HttpLogEntry is renamed to HttpLog.

- HttpLog#log is renamed to formattedLog.

- drivers now need to be imported from their respective paths

### Features

- 🎸 include required driver configuration `identifier` ([#54](https://github.com/ngworker/lumberjack/issues/54)) ([7fc96eb](https://github.com/ngworker/lumberjack/commit/7fc96eb4af48cf57b415b4c6340d47bb0be3ace3))
- 🎸 pass log object to drivers as log method argument ([#49](https://github.com/ngworker/lumberjack/issues/49)) ([5004d39](https://github.com/ngworker/lumberjack/commit/5004d391eb1e0bba2ee1cf301a59eb8df1b75b16))
- 🎸 add prodMode option to config used for configure levels ([#42](https://github.com/ngworker/lumberjack/issues/42)) ([6f43438](https://github.com/ngworker/lumberjack/commit/6f4343858fa68b513b1ea6db2c5bf6ebf621d440))
- 🎸 rename LumberjackLog property context to scope ([#53](https://github.com/ngworker/lumberjack/issues/53)) ([4738a16](https://github.com/ngworker/lumberjack/commit/4738a16823c75d3f46b374f22cd789ffd1428628))
- add console logger ([#38](https://github.com/ngworker/lumberjack/issues/38)) ([d432999](https://github.com/ngworker/lumberjack/commit/d4329996076f6be37579143a6754bd288fead169))
- add Critical and Trace log levels ([#37](https://github.com/ngworker/lumberjack/issues/37)) ([5a18941](https://github.com/ngworker/lumberjack/commit/5a1894116b52db450b2116a5898e5c7ea0e82339))
- add separate config token for console driver and support verbose logging ([#27](https://github.com/ngworker/lumberjack/issues/27)) ([e1ba4d2](https://github.com/ngworker/lumberjack/commit/e1ba4d205330c1fcea98ea3906ebca966ac27b47))
- add timestamp to log entries ([#31](https://github.com/ngworker/lumberjack/issues/31)) ([dca4c8e](https://github.com/ngworker/lumberjack/commit/dca4c8e3ddf800d5c483727b9144137bc2114aa9))
- guard against importing ConsoleDriverModule without forRoot ([#12](https://github.com/ngworker/lumberjack/issues/12)) ([a39c01c](https://github.com/ngworker/lumberjack/commit/a39c01cace6b4c83395131bed846f863fd3fbee1))
- require log levels in driver config ([#36](https://github.com/ngworker/lumberjack/issues/36)) ([e0b5777](https://github.com/ngworker/lumberjack/commit/e0b5777ae2bb2cef9492621344e704844dd43315))

### Bug Fixes

- 🐛 change to strict mode and fix related errors ([#9](https://github.com/ngworker/lumberjack/issues/9)) ([bf14217](https://github.com/ngworker/lumberjack/commit/bf142176d1557b61c0853947757c282a12c1d4c5))
- 🐛 make log signature not to support promise or observable ([#10](https://github.com/ngworker/lumberjack/issues/10)) ([06b6fa1](https://github.com/ngworker/lumberjack/commit/06b6fa1670c0eb935fc19da251551ef200a81514))
- 🐛 subscribe to http driver observables ([#13](https://github.com/ngworker/lumberjack/issues/13)) ([aecb807](https://github.com/ngworker/lumberjack/commit/aecb807d20fce25b3a44bc0b6395007a87ff1de7))
- add Critical and Trace to LumberjackLogger ([#47](https://github.com/ngworker/lumberjack/issues/47)) ([96c6634](https://github.com/ngworker/lumberjack/commit/96c6634834803a0b802bf913f9e7aad8129b9a5f))
- handle error-throwing log drivers ([#44](https://github.com/ngworker/lumberjack/issues/44)) ([6164c37](https://github.com/ngworker/lumberjack/commit/6164c3781bf4c5f4be25d88782d362d9a53705bc))
- send log wagon from all log methods ([#7](https://github.com/ngworker/lumberjack/issues/7)) ([083bce9](https://github.com/ngworker/lumberjack/commit/083bce9212e3607b9623d100a433d268d79418e6))
- use valid default config in ConsoleDriverModule.forRoot ([#11](https://github.com/ngworker/lumberjack/issues/11)) ([57965e2](https://github.com/ngworker/lumberjack/commit/57965e2b85b41bfafca33c1b56f33d307ce84ffa))

### perf

- ⚡️ create secondary entrypoints for drivers ([#17](https://github.com/ngworker/lumberjack/issues/17)) ([6bb416a](https://github.com/ngworker/lumberjack/commit/6bb416a6f4b1ca631983418a38eca23b03b2497a))

### Tests

- fix Wallaby and driver tests ([#43](https://github.com/ngworker/lumberjack/issues/43)) ([c1892e9](https://github.com/ngworker/lumberjack/commit/c1892e9262a2d77f73bae8497038de2110c241a3))
- increase test coverage and extract test-util library ([#22](https://github.com/ngworker/lumberjack/issues/22)) ([6cb159c](https://github.com/ngworker/lumberjack/commit/6cb159c3162c095019b2621443b7790c83723770))

### refactor

- normalize terminology and project structure ([#50](https://github.com/ngworker/lumberjack/issues/50)) ([6001525](https://github.com/ngworker/lumberjack/commit/6001525df31dc5024571fe251a809257372b5c5e))

### [1.0.8](https://github.com/ngworker/lumberjack/compare/v1.0.7...v1.0.8) (2020-09-26)

### [1.0.7](https://github.com/ngworker/lumberjack/compare/v1.0.6...v1.0.7) (2020-08-28)

### Tests

- 💍 add `LumberjackService` base tests ([9b6f961](https://github.com/ngworker/lumberjack/commit/9b6f961c881a15b4dfa92ace308fbd2cb3306aeb))

### [1.0.6](https://github.com/ngworker/lumberjack/compare/v1.0.5...v1.0.6) (2020-07-30)

### [1.0.5](https://github.com/ngworker/lumberjack/compare/v1.0.4...v1.0.5) (2020-07-29)

### [1.0.4](https://github.com/ngworker/lumberjack/compare/v1.0.3...v1.0.4) (2020-07-29)

### [1.0.3](https://github.com/ngworker/lumberjack/compare/v1.0.2...v1.0.3) (2020-07-22)

### Bug Fixes

- 🐛 remove not published message from readme ([2ccc687](https://github.com/ngworker/lumberjack/commit/2ccc687637894e6f51c2fcfc6fc67d040010ac7a))

### [1.0.2](https://github.com/ngworker/lumberjack/compare/v1.0.1...v1.0.2) (2020-07-22)

### Bug Fixes

- 🐛 cp readme to dist on build lib ([7f04fcc](https://github.com/ngworker/lumberjack/commit/7f04fcc34ad1fe01231182f848e2fbe7dda23cf8))

### [1.0.1](https://github.com/ngworker/lumberjack/compare/v1.0.0...v1.0.1) (2020-07-22)

### Bug Fixes

- 🐛 readme and publish info ([#4](https://github.com/ngworker/lumberjack/issues/4)) ([0f63fe9](https://github.com/ngworker/lumberjack/commit/0f63fe9b6acb3d1295d45ef7b3d98ae8ef709224))

## 1.0.0 (2020-07-22)

### ⚠ BREAKING CHANGES

- add lumberjack core

### Features

- 🎸 add usage example to app.component ([#2](https://github.com/ngworker/lumberjack/issues/2)) ([637c278](https://github.com/ngworker/lumberjack/commit/637c2780905bfe28fbf6b2e8a11b6204c96f81a1))
- 🎸 create general structure of lumberjack library ([087b716](https://github.com/ngworker/lumberjack/commit/087b716c0dd40d49490911c2eb5c5ba598918d85))

### Tests

- 💍 add empty test file ([7f605a2](https://github.com/ngworker/lumberjack/commit/7f605a2515cc173d9d7d6aca804c46cea62bc6bf))
- 💍 convert app test to spectator and add enhance linting ([#3](https://github.com/ngworker/lumberjack/issues/3)) ([1969806](https://github.com/ngworker/lumberjack/commit/1969806c18eab904a8de85ce512e4f20384a7f6a))
