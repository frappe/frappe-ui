// @ts-check
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { addRouteRule, parseRoute } from '../src/frappe.js'

const cli = fileURLToPath(new URL('../index.js', import.meta.url))
const { version } = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)

/**
 * Runs the CLI with no terminal attached, as CI would.
 *
 * @param {string} cwd
 * @param {string[]} args
 */
function create(cwd, args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      npm_config_user_agent: 'yarn/1.22.22 npm/? node/v22',
    },
  })
  return { status: result.status, output: result.stdout + result.stderr }
}

/** @param {string} root */
function readTree(root) {
  /** @type {Record<string, string>} */
  const files = {}
  for (const file of fs.readdirSync(root, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!file.isFile()) continue
    const full = path.join(file.parentPath, file.name)
    files[path.relative(root, full)] = fs.readFileSync(full, 'utf8')
  }
  return files
}

/** @param {Record<string, string>} files */
function assertNoPlaceholders(files) {
  for (const [file, content] of Object.entries(files)) {
    assert.doesNotMatch(
      content,
      /__[A-Z_]+__/,
      `${file} has an unfilled placeholder`,
    )
  }
}

function tempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'create-frappe-ui-'))
}

test('scaffolds a standalone app', () => {
  const cwd = tempDir()
  const run = create(cwd, [
    'my-app',
    '--template',
    'standalone',
    '--yes',
    '--no-install',
  ])
  assert.equal(run.status, 0, run.output)
  assert.match(run.output, /cd my-app\s+yarn install\s+yarn dev/)

  const files = readTree(path.join(cwd, 'my-app'))
  for (const file of [
    '.gitignore',
    'index.html',
    'package.json',
    'tailwind.config.js',
    'postcss.config.js',
    'tsconfig.json',
    'vite.config.ts',
    'src/main.ts',
    'src/App.vue',
    'src/router.ts',
    'src/style.css',
    'src/pages/Home.vue',
    'src/pages/NotFound.vue',
  ]) {
    assert.ok(file in files, `${file} is missing`)
  }
  assertNoPlaceholders(files)

  const pkg = JSON.parse(files['package.json'])
  assert.equal(pkg.name, 'my-app')
  assert.equal(pkg.dependencies['frappe-ui'], `^${version}`)
  assert.match(files['index.html'], /<title>my-app<\/title>/)
  // No Frappe server, so no proxy or boot data.
  assert.match(
    files['vite.config.ts'],
    /frappeui\(\{ frappeProxy: false, jinjaBootData: false, buildConfig: false \}\)/,
  )

  // A second run doesn't write into a folder that already has files.
  fs.writeFileSync(path.join(cwd, 'my-app', 'src', 'main.ts'), '// mine')
  const again = create(cwd, [
    'my-app',
    '--template',
    'standalone',
    '--yes',
    '--no-install',
  ])
  assert.equal(again.status, 1)
  assert.match(again.output, /is not empty/)
  assert.equal(
    fs.readFileSync(path.join(cwd, 'my-app', 'src', 'main.ts'), 'utf8'),
    '// mine',
  )
})

test('scaffolds the frontend of a Frappe app and wires it into the app', () => {
  const bench = tempDir()
  const appRoot = path.join(bench, 'apps', 'todo')
  const pkgDir = path.join(appRoot, 'todo')
  fs.mkdirSync(path.join(bench, 'sites', 'todo.localhost'), { recursive: true })
  fs.writeFileSync(
    path.join(bench, 'sites', 'todo.localhost', 'site_config.json'),
    '{}',
  )
  fs.writeFileSync(
    path.join(bench, 'sites', 'common_site_config.json'),
    '{"webserver_port": 8001}',
  )
  fs.mkdirSync(pkgDir, { recursive: true })
  const hooksPath = path.join(pkgDir, 'hooks.py')
  fs.writeFileSync(
    hooksPath,
    [
      'app_name = "todo"',
      'app_title = "To Do"',
      '',
      'website_route_rules = [',
      '\t{"from_route": "/old/<path:app_path>", "to_route": "old"}',
      ']',
      '',
      'doc_events = {}',
      '',
    ].join('\n'),
  )

  // Outside an app, the frappe template explains where to run it.
  const outside = create(bench, [
    '--template',
    'frappe',
    '--yes',
    '--no-install',
  ])
  assert.equal(outside.status, 1)
  assert.match(outside.output, /No Frappe app found/)

  // The folder name goes into shell scripts, so it can't need escaping.
  const unsafe = create(appRoot, [
    'foo"bar',
    '--template',
    'frappe',
    '--yes',
    '--no-install',
  ])
  assert.equal(unsafe.status, 1)
  assert.match(unsafe.output, /frontend folder name/)
  assert.ok(!fs.existsSync(path.join(appRoot, 'foo"bar')))

  const run = create(appRoot, ['--template', 'frappe', '--yes', '--no-install'])
  assert.equal(run.status, 0, run.output)
  assert.match(
    run.output,
    /bench --site todo\.localhost set-config ignore_csrf 1/,
  )
  assert.match(run.output, /http:\/\/todo\.localhost:8081\/todo/)

  const files = readTree(path.join(appRoot, 'frontend'))
  assertNoPlaceholders(files)
  const pkg = JSON.parse(files['package.json'])
  assert.equal(pkg.name, 'todo-frontend')
  assert.equal(pkg.dependencies['frappe-ui'], `^${version}`)
  assert.match(
    files['vite.config.ts'],
    /frappeui\(\{ frontendRoute: '\/todo' \}\)/,
  )
  assert.match(files['src/router.ts'], /createWebHistory\('\/todo'\)/)
  assert.match(files['index.html'], /<title>To Do<\/title>/)

  // bench installs and builds the frontend through the app's package.json.
  const rootPackagePath = path.join(appRoot, 'package.json')
  assert.deepEqual(JSON.parse(fs.readFileSync(rootPackagePath, 'utf8')), {
    private: true,
    scripts: {
      postinstall: 'cd frontend && yarn install',
      dev: 'cd frontend && yarn dev',
      build: 'cd frontend && yarn build',
    },
  })

  const gitignorePath = path.join(appRoot, '.gitignore')
  assert.equal(
    fs.readFileSync(gitignorePath, 'utf8'),
    '# Built by the frontend\ntodo/public/frontend\ntodo/www/todo.html\n',
  )

  const pagePath = path.join(pkgDir, 'www', 'todo.py')
  assert.match(
    fs.readFileSync(pagePath, 'utf8'),
    /"csrf_token": frappe\.sessions\.get_csrf_token\(\)/,
  )
  const hooks = fs.readFileSync(hooksPath, 'utf8')
  assert.equal(
    hooks,
    [
      'app_name = "todo"',
      'app_title = "To Do"',
      '',
      'website_route_rules = [',
      '\t{"from_route": "/old/<path:app_path>", "to_route": "old"},',
      '\t{"from_route": "/todo/<path:app_path>", "to_route": "todo"},',
      ']',
      '',
      'doc_events = {}',
      '',
    ].join('\n'),
  )

  // Running it again after removing the frontend leaves the rest of the app
  // alone.
  fs.writeFileSync(pagePath, '# edited by hand\n')
  const rootPackage = fs.readFileSync(rootPackagePath, 'utf8')
  fs.rmSync(path.join(appRoot, 'frontend'), { recursive: true })
  const again = create(pkgDir, [
    '--template',
    'frappe',
    '--yes',
    '--no-install',
  ])
  assert.equal(again.status, 0, again.output)
  assert.ok(fs.existsSync(path.join(appRoot, 'frontend', 'package.json')))
  assert.equal(fs.readFileSync(hooksPath, 'utf8'), hooks)
  assert.equal(
    fs.readFileSync(gitignorePath, 'utf8'),
    '# Built by the frontend\ntodo/public/frontend\ntodo/www/todo.html\n',
  )
  assert.equal(fs.readFileSync(pagePath, 'utf8'), '# edited by hand\n')
  assert.equal(fs.readFileSync(rootPackagePath, 'utf8'), rootPackage)

  // A build script that builds something else doesn't count. The scripts to
  // merge in quote a folder name with a space.
  const otherBuild = '{ "scripts": { "build": "vite build" } }\n'
  fs.writeFileSync(rootPackagePath, otherBuild)
  const other = create(appRoot, [
    'my frontend',
    '--template',
    'frappe',
    '--yes',
    '--no-install',
  ])
  assert.equal(other.status, 0, other.output)
  assert.match(other.output, /doesn't build my frontend/)
  assert.match(other.output, /"build": "cd \\"my frontend\\" && yarn build"/)
  assert.equal(fs.readFileSync(rootPackagePath, 'utf8'), otherBuild)
})

test('adds the route rule to any shape of hooks.py it can edit safely', () => {
  const rule = '{"from_route": "/todo/<path:app_path>", "to_route": "todo"},'

  // No rules yet: a new list goes at the end, indented with a tab like the
  // rest of Frappe.
  const appended = addRouteRule(
    'app_name = "todo"\n# \t"route": "/todo",\n',
    '/todo',
  )
  assert.deepEqual(appended, {
    status: 'added',
    source: `app_name = "todo"\n# \t"route": "/todo",\n\n# Load the frontend on every path under /todo\nwebsite_route_rules = [\n\t${rule}\n]\n`,
  })
  assert.deepEqual(
    addRouteRule(/** @type {{ source: string }} */ (appended).source, '/todo'),
    { status: 'present' },
  )

  // An empty list is filled in place. A file indented with spaces gets spaces.
  assert.deepEqual(
    addRouteRule('if x:\n    pass\nwebsite_route_rules = []\n', '/todo'),
    {
      status: 'added',
      source: `if x:\n    pass\nwebsite_route_rules = [\n    ${rule}\n]\n`,
    },
  )

  // A rule that is commented out doesn't count.
  assert.equal(
    addRouteRule(`website_route_rules = [\n    # ${rule}\n]\n`, '/todo').status,
    'added',
  )

  // A "]" inside a string or a comment doesn't end the list.
  assert.equal(
    /** @type {{ source: string }} */ (
      addRouteRule(
        'website_route_rules = [\n    # old rules]\n    {"from_route": "/a]", "to_route": "a"},\n]\n',
        '/todo',
      )
    ).source,
    `website_route_rules = [\n    # old rules]\n    {"from_route": "/a]", "to_route": "a"},\n    ${rule}\n]\n`,
  )

  // Shapes it can't edit safely come back as a rule to paste in.
  for (const source of [
    'website_route_rules = [{"from_route": "/a", "to_route": "a"}]\n',
    'website_route_rules = [\n    {"from_route": "/a", "to_route": "a"}  # a\n]\n',
    'website_route_rules = get_rules()\n',
    'website_route_rules = []\nwebsite_route_rules += extra\n',
  ]) {
    assert.deepEqual(
      addRouteRule(source, '/todo'),
      { status: 'manual', snippet: rule },
      source,
    )
  }
})

test('turns down routes that Frappe serves itself', () => {
  assert.deepEqual(parseRoute('todo/'), { route: '/todo' })
  for (const route of ['/api', '/Api', 'app/tasks']) {
    assert.ok('error' in parseRoute(route), route)
  }
})

test('is versioned with frappe-ui, so it pins the release it shipped with', () => {
  const root = new URL('../../../package.json', import.meta.url)
  if (!fs.existsSync(root)) return
  const frappeUi = JSON.parse(fs.readFileSync(root, 'utf8'))
  assert.equal(frappeUi.name, 'frappe-ui')
  assert.equal(version, frappeUi.version)
})
