# create-frappe-ui

Create a [frappe-ui](https://ui.frappe.io) app in one command.

```sh
npm create frappe-ui@latest
```

It asks where to create the project and what it is for, then sets up Vue 3,
TypeScript, Vite, Tailwind CSS and frappe-ui with a starter page. You need Node
20.19 or later.

## Templates

**frappe** builds the frontend of a Frappe app. Run it from your app's folder:

```sh
cd apps/todo
npm create frappe-ui@latest
```

It creates `frontend/` and connects it to the app:

| File               | Change                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `todo/www/todo.py` | Created. It sends the boot data, such as the CSRF token, to the page.                                                   |
| `todo/hooks.py`    | A rule is added to `website_route_rules`, so every path under `/todo` loads the app.                                    |
| `package.json`     | Created, with scripts that run in `frontend/`. `bench build` and deploys build the frontend through its `build` script. |
| `.gitignore`       | The build output, `todo/public/frontend` and `todo/www/todo.html`, is added.                                            |

It lists these changes and asks before it writes them. It never replaces an
existing file, and it doesn't add a route rule that is already there, so it's
safe to run again. When `hooks.py` or an existing `package.json` can't be edited
safely, it prints the lines for you to add.

**standalone** is a plain Vite app with no Frappe server: a prototype, a static
site, or a frontend for another backend.

## Options

With npm, put the options after `--`:

```sh
npm create frappe-ui@latest my-app -- --template standalone --yes
```

| Option                      | What it does                                                                 |
| --------------------------- | ---------------------------------------------------------------------------- |
| `[dir]`                     | The project folder. Default: `frontend` in a Frappe app, otherwise `my-app`. |
| `-t, --template <name>`     | `frappe` or `standalone`                                                     |
| `--route <path>`            | Where the site serves the app, like `/todo`. Frappe only. Default: `/<app>`  |
| `--install`, `--no-install` | Install dependencies, or don't                                               |
| `-y, --yes`                 | Use the default answers and don't ask anything                               |
| `-h, --help`                | Show the help                                                                |

Without a terminal, such as in CI, it also uses the default answers.

It installs with the package manager that ran it: npm, yarn, pnpm or bun. It
won't write into a folder that has files in it unless you confirm, and `--yes`
never confirms that for you.

## Versions

The version of `create-frappe-ui` is always the same as the version of
`frappe-ui`. The new project depends on that version: `create-frappe-ui@1.0.0`
writes `"frappe-ui": "^1.0.0"`. So `npm create frappe-ui@1.2.0` sets up a
project on frappe-ui 1.2.

### Releasing

Release both packages together:

1. Set the same `version` in `package.json` at the repository root and in
   `packages/create-frappe-ui/package.json`. A test fails when they differ.
2. Publish frappe-ui, then publish this package from
   `packages/create-frappe-ui`. Give it the `latest` tag, even for a prerelease,
   because the docs tell people to run `npm create frappe-ui@latest`:

   ```sh
   npm publish --tag latest
   ```

## Development

The package is plain JavaScript with JSDoc types, so there is no build step. The
templates are in `templates/`: `base/` has the files that both templates share,
and `frappe/` and `standalone/` add to it or replace files in it. Words like
`__TITLE__` in template files are filled in when the project is created.

```sh
npm install
npm test
npm run check   # type-check the JSDoc types
node index.js --help
```
