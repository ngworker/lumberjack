import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/core';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import * as path from 'path';

import { ngAdd } from './index';
import { NgAddOptions } from './schema';

function readModuleFile(tree: Tree, project: string, module: string): string {
  return (
    tree.read(
      path.sep + path.join(workspaceOptions.newProjectRoot || 'projects', project, 'src', 'app', `${module}.module.ts`)
    ) || ''
  ).toString('utf-8');
}

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

describe('@ngworker/lumberjack:ng-add schematic', () => {
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
      module: 'app',
      name: '',
    };
  });

  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let options: NgAddOptions;

  describe('Lumberjack', () => {
    it('imports LumberjackModule in the specified ES module', async () => {
      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(/\nimport { LumberjackModule } from '@ngworker\/lumberjack';/);
    });

    it('registers Lumberjack in the specified Angular module', async () => {
      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(/\s+imports:\s*\[\s*BrowserModule,\s*LumberjackModule.forRoot\(\)/);
    });
  });

  describe('Console driver', () => {
    const consoleDriverImportPattern =
      /\s+imports:\s*\[\s*BrowserModule,\s*LumberjackModule.forRoot\(\),\s*LumberjackConsoleDriverModule.forRoot\(\)/;

    it('imports LumberjackConsoleDriverModule in the specified ES module', async () => {
      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(
        /\nimport { LumberjackConsoleDriverModule } from '@ngworker\/lumberjack\/console-driver';/
      );
    });

    it('registers the console driver in the specified Angular module by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(consoleDriverImportPattern);
    });

    it('registers the console driver in the specified Angular module when the "consoleDriver" option is true', async () => {
      options = {
        ...options,
        consoleDriver: true,
      };

      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(consoleDriverImportPattern);
    });

    it('does not register the console driver in the specified Angular module when the "consoleDriver" option is false', async () => {
      options = {
        ...options,
        consoleDriver: false,
      };

      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).not.toMatch(consoleDriverImportPattern);
    });
  });

  describe('HTTP driver', () => {
    beforeEach(() => {
      options = {
        ...options,
        consoleDriver: false,
      };
    });

    const httpDriverImportPattern =
      /\s+imports:\s*\[\s*BrowserModule,\s*LumberjackModule.forRoot\(\),\s*LumberjackHttpDriverModule.withOptions\(\{.*\}\)/;

    it('imports LumberjackConsoleDriverModule in the specified ES module when the "httpDriver" option is true', async () => {
      options = {
        ...options,
        httpDriver: true,
      };

      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content /*?*/ = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(/\nimport { LumberjackHttpDriverModule } from '@ngworker\/lumberjack\/http-driver';/);
    });

    it('does not register the HTTP driver in the specified Angular module by default', async () => {
      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).not.toMatch(httpDriverImportPattern);
    });

    it('registers the HTTP driver in the specified Angular module when the "httpDriver" option is true', async () => {
      options = {
        ...options,
        httpDriver: true,
      };

      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(httpDriverImportPattern);
    });

    it('does not register the HTTP driver in the specified Angular module when the "httpDriver" option is false', async () => {
      options = {
        ...options,
        httpDriver: false,
      };

      const tree = await schematicRunner.runSchematicAsync('ng-add', options, appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).not.toMatch(httpDriverImportPattern);
    });
  });

  describe('path parameter', () => {
    it('assumes a default path when only a project is passed', async () => {
      const tree = await schematicRunner.callRule(ngAdd(options), appTree).toPromise();

      const content = readModuleFile(tree as UnitTestTree, options.project, options.module || '');
      expect(content).toMatch(/\nimport { LumberjackModule } from '@ngworker\/lumberjack';/);
    });
  });
});
