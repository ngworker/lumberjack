/* tslint:disable */
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
// import * as path from 'path';
import { NgAddOptions } from './schema';

export const workspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
  defaultProject: 'bar',
};

export const appOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: 'css',
  skipTests: false,
  skipPackageJson: false,
};

// const collectionPath = path.join('../collection.json');
const collectionPath = require.resolve('../collection.json');

describe('ng add function', () => {
  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;

  const defaultOptions: NgAddOptions = {
    project: 'bar',
    module: 'app',
    name: '',
  };

  beforeEach(async () => {
    schematicRunner = new SchematicTestRunner('schematics', collectionPath);
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'workspace', workspaceOptions)
      .toPromise();
    appTree = await schematicRunner
      .runExternalSchematicAsync('@schematics/angular', 'application', appOptions, appTree)
      .toPromise();
  });

  it('should import LumberjackModule a specified module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();
    const content = tree.readContent(`/projects/bar/src/app/app.module.ts`);
    expect(content).toContain(`import { LumberjackModule } from '@ngworker/lumberjack'`);
  });
});
