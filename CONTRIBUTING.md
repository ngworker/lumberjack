# Contributing to Lumberjack

🙏 We would ❤️ for you to contribute to Lumberjack and help make it even better than it is today!

## Developing

Start by installing all dependencies:

```bash
yarn
```

Run the tests:

```bash
yarn test
yarn e2e
```

Run the playground app:

```bash
yarn start
```

## Building

```bash
yarn build
```

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes **must be tested** by one or more specs (unit-tests).
- All public API methods **must be documented**.

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Lumberjack changelog**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/angular/angular/commits/master))

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

## ESLint parser

As this workspace has a small amount of projects, we opt in to use the ESLint TypeScript parser globally (see the `parser` option in `.eslintrc.json`) in order to enable type-depending lint rules such as some from SonarLint.

## Creating new applications

In this workspace we have chosen to use the `npm` Nx preset which has the following workspace layout:

```json
  "workspaceLayout": {
    "appsDir": "e2e",
    "libsDir": "packages"
  }
```

That means that our applications are created by default in the `e2e` folder and our libraries in the `packages` folder.

However, this is semantically incorrect and we have also decided that our application will leave in the packages folder.

When creating a new app there are some steps that need to be taken in order to bypass the default behavior of the **npm nx preset**.

First, we need to **temporarily** modify the workspace layout inside the `nx.json` file from

```json
  "workspaceLayout": {
    "appsDir": "e2e",
    "libsDir": "packages"
  }
```

To

```json
  "workspaceLayout": {
    "appsDir": "packages",
    "libsDir": "e2e"
  }
```

Once that's completed we can create our application with the corresponding generator command.

Finally we MUST revert the changes made to the `nx.json` file.

In cases where the application generator creates a companion e2e project, we need to move it to the `e2e` folder. This is done using the `@nx/workspace:move` generator.

```bash
nx generate move [<grouping-folder>/]<e2e-project-directory-name> --project-name=<e2e-project-name>
```

> Notice that this is only possible after reverting the nx.json file back to its original form.

## Project tags

A project must have the following dimensions.

- Scope
- Type
- Technology

### Scope

A project is either _internal_ to the workspace or _public_ for external use.

| Scope      | Description                                                                    |
| ---------- | ------------------------------------------------------------------------------ |
| `internal` | The project is internal to the workspace and is not intended for external use. |
| `public`   | The project is publicly released and intended for external use.                |

### Type

The following are valid project types in this workspace.

| Type        | Description                                               |
| ----------- | --------------------------------------------------------- |
| `app`       | An application project.                                   |
| `e2e`       | An end-to-end testing project.                            |
| `package`   | A publishable library project released as an npm package. |
| `test-util` | A library project containing internal test utilities.     |

### Technology

The following are valid project types in this workspace.

| Technology   | Description                                       |
| ------------ | ------------------------------------------------- |
| `javascript` | A project that is framework agnostic.             |
| `angular`    | A project that is based on the Angular framework. |
| `qwik`       | A project that is based on the Qwik framework.    |
| `solid`      | A project that is based on the SolidJS framework. |
| `react`      | A project that is based on the React framework.   |
| `nest`       | A project that is based on the NestJS framework.  |
