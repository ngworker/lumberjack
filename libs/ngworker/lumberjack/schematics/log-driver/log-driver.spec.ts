import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/core';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

import { LogOptions } from './schema';

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
  let options: LogOptions;

  it('should import myLogDriverConfigToken into service', async () => {
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/projects/bar/src/app/console/console-driver.service.ts');

    expect(consoleService).toContain(`import { myLogDriverConfigToken } from './console-driver-config.token';`);
  });

  it('should create all files for logger', async () => {
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const driverFiles = tree.files.filter((file) => file.includes('console-driver'));

    expect(driverFiles.length).toBe(6);
  });

  it('should create files inside a folder when flat is false', async () => {
    options = { ...options, flat: true };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/projects/bar/src/app/console-driver.service.ts');

    expect(consoleService).toContain(`import { myLogDriverConfigToken } from './console-driver-config.token';`);
  });

  it('should create files inside a folder when path is provided', async () => {
    options = { ...options, path: 'logger' };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const consoleService = tree.readContent('/logger/console/console-driver.service.ts');

    expect(consoleService).toContain(`import { myLogDriverConfigToken } from './console-driver-config.token';`);
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
  let options: LogOptions;

  it('create logger files without test files', async () => {
    options = { ...options, skipTests: true };
    const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

    const testFiles = tree.files.filter((file) => file.includes('spec.ts'));

    expect(testFiles.length).toBe(1);
  });
});
