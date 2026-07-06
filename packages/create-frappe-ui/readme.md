# create-frappe-ui

Create a minimal Vue app with Frappe UI.

```sh
npm create frappe-ui@latest frontend
```

The initializer creates a TypeScript-only Vue starter. It asks whether to
configure the project with a Frappe backend; if enabled, the target directory
must be inside `apps/<appname>/<folder>` and the CLI will ask for the frontend
base route.

This package is published separately from `frappe-ui` so npm can resolve the
`npm create frappe-ui` command to the `create-frappe-ui` initializer.
