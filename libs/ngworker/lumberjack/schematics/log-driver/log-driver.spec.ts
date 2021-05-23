import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/core';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

import { LogDriverOptions } from './schema';

const projectName = 'bar';
const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: VERSION.full,
};
const appOptions: ApplicationOptions = {
  name: projectName,
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: Style.Css,
  skipTests: false,
  skipPackageJson: false,
};
const collectionPath = path.resolve(__dirname, '../collection.json');

describe('@ngworker/lumberjack:log-driver schematic with Tests', () => {
  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner('@ngworker/lumberjack', collectionPath);
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree)
      .toPromise();
    options = {
      project: projectName,
      name: 'console',
    };
  });

  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let options: LogDriverOptions;

  it('should import consoleDriverConfigToken into service', async () => {
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/projects/bar/src/app/console-driver/log-drivers/console.driver.ts');

    expect(consoleService).toContain(
      `import { consoleDriverConfigToken } from '../configuration/console-driver-config.token';`
    );
  });

  it('should create all files for log driver', async () => {
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const driverFiles = tree.files.filter((file) => file.includes('console-driver') || file.includes('console.driver'));

    expect(driverFiles.length).toBe(8);
  });

  it('should create files inside a folder when flat is false', async () => {
    options = { ...options, flat: true };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/projects/bar/src/app/log-drivers/console.driver.ts');

    expect(consoleService).toContain(
      `import { consoleDriverConfigToken } from '../configuration/console-driver-config.token';`
    );
  });

  it('should create files inside a folder when path is provided', async () => {
    options = { ...options, path: 'subdir' };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/subdir/console-driver/log-drivers/console.driver.ts');

    expect(consoleService).toContain(
      `import { consoleDriverConfigToken } from '../configuration/console-driver-config.token';`
    );
  });
});

describe('@ngworker/lumberjack:log-driver schematic without Tests', () => {
  const newOptions = { ...appOptions, skipTests: true };
  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner('@ngworker/lumberjack', collectionPath);
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', newOptions, appTree)
      .toPromise();
    options = {
      project: projectName,
      name: 'console',
    };
  });

  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let options: LogDriverOptions;

  it('create log driver files without test files', async () => {
    options = { ...options, skipTests: true };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const driverFiles = tree.files.filter((file) => file.includes('console-driver'));

    const specFiles = driverFiles.filter((file) => file.includes('spec.ts'));

    expect(specFiles.length).toBe(0);
  });
});
