import { readdir } from 'node:fs/promises'

const genPage = (name) => {
  return `
<h1>
  ${name}
</h1>

<br/>

<preview path="@/components/${name}/${name}.story.vue"  />
`
}

const componentsFolder = '../../src/components/'

const dirs = await readdir(componentsFolder, { recursive: false })

const outDir = '../docs/'

dirs.forEach((dir) => {
  if (!dir.includes('.vue')) {
    const name = dir.split('.')[0]
    const html = genPage(name)
    const filename = name.toLowerCase() + '.md'
    Bun.write(outDir + filename, html)
  }
})
