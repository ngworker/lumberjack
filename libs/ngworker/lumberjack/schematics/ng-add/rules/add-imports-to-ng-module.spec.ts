import * as path from 'path';
import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { VERSION } from '@angular/core';
import { Schema as ApplicationOptions, Style } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';

import { NgAddOptions } from '../schema';

import { addImportsToNgModule } from './add-imports-to-ng-module';

function readModuleFile(tree: Tree, project: string, module: string): string {
  return (
    tree.read(
      path.sep + path.join(workspaceOptions.newProjectRoot || 'projects', project, 'src', 'app', `${module}.module.ts`)
    ) || ''
  ).toString();
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
const collectionPath = path.resolve(__dirname, '../../collection.json');

describe(addImportsToNgModule.name, () => {
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
      path: path.join(workspaceOptions.newProjectRoot || 'projects', projectName, 'src'),
      consoleDriver: true,
    };
  });

  let appTree: UnitTestTree;
  let schematicRunner: SchematicTestRunner;
  let options: NgAddOptions;

  describe('Lumberjack', () => {
    it('imports LumberjackModule in the specified ES module', async () => {
      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(/\nimport { LumberjackModule } from '@ngworker\/lumberjack';/);
    });

    it('registers Lumberjack in the specified Angular module', async () => {
      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(/\s+imports:\s*\[\s*BrowserModule,\s*LumberjackModule.forRoot\(\)/);
    });
  });

  describe('Console driver', () => {
    const consoleDriverImportPattern =
      /\s+imports:\s*\[\s*BrowserModule,\s*LumberjackModule.forRoot\(\),\s*LumberjackConsoleDriverModule.forRoot\(\)/;

    it('imports LumberjackConsoleDriverModule in the specified ES module', async () => {
      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(
        /\nimport { LumberjackConsoleDriverModule } from '@ngworker\/lumberjack\/console-driver';/
      );
    });

    it('registers the console driver in the specified Angular module by default', async () => {
      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(consoleDriverImportPattern);
    });

    it('registers the console driver in the specified Angular module when the "consoleDriver" option is true', async () => {
      options = {
        ...options,
        consoleDriver: true,
      };

      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).toMatch(consoleDriverImportPattern);
    });

    it('does not register the console driver in the specified Angular module when the "consoleDriver" option is false', async () => {
      options = {
        ...options,
        consoleDriver: false,
      };

      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      const content = readModuleFile(tree, options.project, options.module || '');
      expect(content).not.toMatch(consoleDriverImportPattern);
    });
  });

  describe('Error handling', () => {
    it('is a no-op when the "skipImport" option is true', async () => {
      options = {
        ...options,
        skipImport: true,
      };

      const tree = await schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      expect(appTree).toBe(tree);
    });

    it('throws an error when the specified Angular module does not exist', () => {
      const modulePath =
        path.sep +
        path.join(
          workspaceOptions.newProjectRoot || 'projects',
          projectName,
          'src',
          'app',
          `${options.module}.module.ts`
        );
      appTree.delete(modulePath);

      const act = schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(act).rejects.toThrow("Specified module 'app' does not exist.");
    });

    it('throws an error when the specified Angular module cannot be read', () => {
      // eslint-disable-next-line no-null/no-null
      jest.spyOn(appTree, 'read').mockReturnValue(null);

      const act = schematicRunner.callRule(addImportsToNgModule(options), appTree).toPromise();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      expect(act).rejects.toThrow('Cannot read "/projects/bar/src/app/app.module.ts".');
    });
  });
});
