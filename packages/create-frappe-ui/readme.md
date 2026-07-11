# create-frappe-ui

Create a minimal Vue app with Frappe UI.

Requires Node.js 20.19 or newer, or Node.js 22.12 or newer.

```sh
npm create frappe-ui@latest frontend
```

The initializer creates a TypeScript-only Vue starter. It asks whether to
configure the project with a Frappe backend; if enabled, the target directory
must be inside `apps/<appname>/<folder>` and the CLI will ask for the frontend
base route.

Use `--force` to scaffold into a non-empty directory. It overwrites files whose
paths match the starter template and leaves unrelated files in place. Commit or
back up existing work before using it.

This package is published separately from `frappe-ui` so npm can resolve the
`npm create frappe-ui` command to the `create-frappe-ui` initializer.
