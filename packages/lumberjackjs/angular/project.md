# implicitDependencies

The test utility libraries are removed from the dependency graph to prevent circular dependencies from breaking the build because of test suites using these libraries. A lint rule prevents non-test files from using them so that the dependency graph is accurate when considering library source code.
