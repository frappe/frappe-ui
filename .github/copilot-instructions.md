# Frappe UI - Copilot Instructions

## Overview

Frappe UI is a Vue 3 component library and UI framework for rapidly building modern frontends for Frappe apps. It provides reusable components, data-fetching utilities, directives, and Tailwind-based styling.

**Repository Type**: NPM Package / Vue 3 Component Library  
**Primary Languages**: TypeScript, Vue, JavaScript  
**Framework**: Vue 3  
**Styling**: TailwindCSS  
**Build Tool**: Vite  
**Package Manager**: Yarn (v1.22.22)  
**Node Version**: v20.x (CI uses Node 20 and 22)

## Build & Development Commands

**IMPORTANT**: Always use Yarn (not npm) for all package management and script execution.

### Dependencies Installation
```bash
yarn install --frozen-lockfile
```
Always use `--frozen-lockfile` flag to ensure consistent dependency versions.

### Testing
```bash
yarn test
```
- Runs Vitest test suite in run mode (non-watch)
- Tests are located in `src/data-fetching/` subdirectories with `.test.ts` suffix
- Uses MSW (Mock Service Worker) for API mocking
- Test setup file: `vitest.setup.ts`
- All tests must pass before publishing

### Type Checking
```bash
yarn type-check
```
- Runs TypeScript compiler in no-emit mode
- **Known Issue**: Type checking currently has errors related to generated `.d.ts` files in `src/mocks/` directory
- These errors are pre-existing and should not block PRs unless you're modifying TypeScript configuration

### Building
```bash
yarn build
```
- Uses Vite to build the library
- Outputs to `dist/` directory
- Build time: ~8-10 seconds
- **Note**: You may see a Browserslist warning - this is informational only

### Development Server
```bash
yarn dev
```
Starts Vite development server for local development.

### Component Story Development
```bash
yarn story:dev        # Start Histoire dev server
yarn story:build      # Build Histoire documentation
yarn story:preview    # Preview built Histoire
```
Histoire is used for component documentation and visual testing.

### Code Formatting
```bash
yarn prettier
```
- Automatically formats code using Prettier
- Configured with Tailwind CSS plugin
- Pre-commit hooks run Prettier automatically (see `.pre-commit-config.yaml`)

## Project Structure

```
frappe-ui/
├── .github/
│   └── workflows/         # CI/CD workflows
│       ├── vitest.yml     # Runs tests on push/PR
│       ├── publish.yml    # NPM publish on main branch
│       └── story-publish.yml
├── src/
│   ├── components/        # Vue components (Button, Dialog, etc.)
│   ├── composables/       # Vue composables
│   ├── data-fetching/     # Data fetching utilities (useDoc, useList, etc.)
│   ├── directives/        # Vue directives
│   ├── resources/         # Resource management
│   ├── utils/             # Utility functions
│   ├── mocks/             # MSW test mocks
│   ├── fonts/             # Font files
│   └── style.css          # Main stylesheet
├── frappe/                # Frappe-specific utilities
├── icons/                 # Icon utilities
├── tailwind/              # Tailwind configuration
├── vite/                  # Vite plugins
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── histoire.config.ts
```

### Key Directories

- **src/components/**: Vue 3 components organized by component name. Each component typically has its own directory with the main `.vue` file
- **src/data-fetching/**: Composables for fetching data from Frappe backend (`useDoc`, `useList`, `useCall`, `useDoctype`)
- **src/utils/**: Utility functions including Tailwind config preset
- **frappe/**: Core utilities for interacting with Frappe framework backend

## Configuration Files

- **vite.config.ts**: Vite configuration with Vue plugin and Lucide icons
- **vitest.config.ts**: Vitest test configuration with global test mode
- **tsconfig.json**: TypeScript configuration with path aliases (`@/*` → `src/*`)
- **tailwind.config.js**: Tailwind CSS configuration (also provides preset for consumers)
- **histoire.config.ts**: Histoire (component documentation) configuration
- **.pre-commit-config.yaml**: Pre-commit hooks for Prettier formatting

## GitHub Actions / CI

### Test Workflow (`.github/workflows/vitest.yml`)
- **Triggers**: Push to main, PRs to main
- **Node Version**: 22
- **Steps**: 
  1. Checkout code
  2. Setup Node with Yarn cache
  3. `yarn install --frozen-lockfile`
  4. `yarn test`

### Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers**: Push to main branch
- **Node Version**: 20
- **Steps**:
  1. Update npm to latest
  2. `npm install`
  3. `npm test`
  4. `npm publish`
- **Note**: The publish workflow uses npm commands as configured in the CI environment for publishing to the NPM registry

## Important Development Guidelines

### Package Management
- **ALWAYS use Yarn** (never npm) for installing dependencies or running scripts
- Use `yarn add <package>` to add dependencies
- Use `yarn add -D <package>` for dev dependencies
- Use `--frozen-lockfile` when installing in CI or for reproducible builds

### Code Style
- Prettier is enforced via pre-commit hooks
- Tailwind CSS classes should be formatted with prettier-plugin-tailwindcss
- Files affected by pre-commit hooks: `*.js`, `*.vue`

### Component Development
- Components are Vue 3 Composition API based
- Use `<script setup>` syntax for new components
- TypeScript is preferred for type safety
- Components should be organized in their own directories under `src/components/`

### Testing
- Write tests for data-fetching composables
- Use Vitest for all tests
- Mock API calls using MSW (setup in `src/mocks/`)
- Tests should be co-located with the code they test (`.test.ts` files)

### Dependencies
Key dependencies:
- **Vue 3**: UI framework (peer dependency >=3.5.0)
- **TailwindCSS**: Utility-first CSS framework
- **@headlessui/vue**: Unstyled, accessible UI components
- **TipTap**: Rich text editor (ProseMirror-based)
- **dayjs**: Date manipulation
- **Vite**: Build tool
- **Vitest**: Testing framework
- **TypeScript**: Type system

### Common Pitfalls

1. **Don't use npm**: This project uses Yarn. Using npm may cause lockfile conflicts
2. **Type-check errors**: The current type-check command has pre-existing errors in `src/mocks/` - don't try to fix these unless explicitly tasked
3. **Test warnings**: MSW warnings about unhandled requests and error parsing errors in tests are expected - tests still pass
4. **Frozen lockfile**: Always use `--frozen-lockfile` in CI or when you want reproducible installs

## Making Changes

1. Install dependencies: `yarn install --frozen-lockfile`
2. Make your changes to the relevant files
3. Run tests: `yarn test`
4. Format code: `yarn prettier` (or let pre-commit hooks handle it)
5. Build to verify: `yarn build`
6. Commit changes (pre-commit hooks will auto-format)

## Package Exports

The package exports multiple entry points:
- Main export: `./src/index.ts`
- Frappe utilities: `./frappe/index.js`
- Icons: `./icons/index.ts`
- Tailwind preset: `./tailwind/index.js`
- Vite utilities: `./vite/index.js`
- Styles: `./style.css`
- Base tsconfig: `./tsconfig.base.json`

## Additional Context

- This is a library package meant to be consumed by other projects
- The package is actively used in production by Frappe Cloud, Gameplan, Helpdesk, Insights, Drive, and Builder
- Component documentation is built using Histoire and can be found at https://ui.frappe.io
- The library builds on top of Headless UI and TipTap, providing Frappe-specific styling and utilities

## Trust These Instructions

These instructions have been validated by running the actual build, test, and development commands. When working with this repository, trust these instructions and only search for additional information if something is unclear or if you encounter errors not mentioned here.
