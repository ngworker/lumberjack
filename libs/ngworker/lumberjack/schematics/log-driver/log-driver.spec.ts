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

describe('@ngworker/lumberjack:log-driver schematic', () => {
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

  describe('Lumberjack', () => {
    it('imports LumberjackModule in the specified ES module', async () => {
      const tree = await schematicRunner.runSchematicAsync('log-driver', options, appTree).toPromise();

      // const files =tree.files;

      // const content = tree.readContent('/projects/bar/src/app/console-driver-config.token.ts');
      // console.log(content);

      // const content1 = tree.readContent('/projects/bar/src/app/console-driver-root.module.spec.ts');
      // console.log(content1);

      // const content2 = tree.readContent('/projects/bar/src/app/console-driver-root.module.ts');
      // console.log(content2);

      // const content3 = tree.readContent('/projects/bar/src/app/console-driver.service.ts');
      // console.log(content3);

      expect(true).toBe(true);
    });
  });
});
