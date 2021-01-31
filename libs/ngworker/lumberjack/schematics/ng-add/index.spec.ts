import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/core';
import * as path from 'path';

import { NgAddOptions } from './schema';

const projectName = 'bar';
const workspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: VERSION.full,
  defaultProject: projectName,
};
const appOptions = {
  name: projectName,
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: 'css',
  skipTests: false,
  skipPackageJson: false,
};
const collectionPath = path.resolve(__dirname, '../collection.json');

describe('@ngworker/lumberjack:ng-add schematic', () => {
  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner('schematics', collectionPath);
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree)
      .toPromise();
    options = {
      project: 'bar',
      module: 'app',
      name: '',
    };
  });

  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let options: NgAddOptions;

  it('adds LumberjackModule in an import statement in the specified module', async () => {
    const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

    const content = tree.readContent(
      `/${workspaceOptions.newProjectRoot}/${options.project}/src/app/${options.module}.module.ts`
    );
    expect(content).toContain(`import { LumberjackModule } from '@ngworker/lumberjack'`);
  });
});
