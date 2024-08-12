const { describe, it, afterEach, beforeEach } = require('node:test')
const frappeui = require('./vite.js')
const fs = require('fs/promises')
const path = require('path')
const assert = require('assert')
const os = require('os')


describe('Test site_config resolution', () => {

  let tmpDir
  let site_config_path
  let cwd
  const jsonData = { webserver_port: "1001" }
  const proxySource = '^/(app|login|api|assets|files)'
  const localhostTarget = 'http://127.0.0.1'

  beforeEach(async () => {
    dirPath = path.join(os.tmpdir(), ts())
    tmpDir = await fs.mkdtemp(dirPath)
    await fs.mkdir(path.join(tmpDir, 'sites'))
    await fs.mkdir(path.join(tmpDir, 'apps'))
    const sitesDir = path.join(tmpDir, 'sites')
    scp = path.join(sitesDir, 'common_site_config.json')
    await fs.writeFile(scp, JSON.stringify(jsonData), 'utf8')

    // TODO: avoid chdir in tests. Unfortunately the code under test uses 
    // relative paths, and changing that will need a bigger change than 
    // simply doing this. 
    cwd = process.cwd()
    process.chdir(sitesDir)
  })

  afterEach(async () => {
    process.chdir(cwd)
    await fs.rm(tmpDir, { recursive: true })
  })

  it('should find commmon_site_config.json', () => {
    site_config = frappeui()
    got_target = site_config.config().server.proxy[proxySource].target
    want_target = localhostTarget + ':' + jsonData.webserver_port
    assert.ok(got_target == want_target)
  })

  it('should read the provided commmon_site_config.json', async () => {
    let testConfigPath = path.join(tmpDir, 'test.json')
    let testConfig = { webserver_port: "1002" }
    await fs.writeFile(testConfigPath, JSON.stringify(testConfig), 'utf8')

    site_config = frappeui({ site_config_path: testConfigPath })
    got_target = site_config.config().server.proxy[proxySource].target
    want_target = localhostTarget + ':' + testConfig.webserver_port
    assert.ok(got_target == want_target)
  })
})

function ts() {
  const now = new Date();
  const ts = now.toISOString().replace(/[-:]/g, '')
  return ts
}
