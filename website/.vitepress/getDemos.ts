import { codeToHtml } from 'shiki'

const allPreviews = import.meta.glob(
  '../../src/components/**/*.story.vue',
  {
    import: 'default',
    eager: true,
  },
)

const allCodes = import.meta.glob('../../src/components/**/*.story.vue', {
  import: 'default',
  eager: true,
  query: 'raw',
})

const basePath = '../../src/components/'

const capitalize = (str: string) =>  str.charAt(0).toUpperCase() + str.slice(1);

export const getDemo =  (component: string, variant: string) => {
	component = capitalize(component);
	const filename = `${component}/${component}.story.vue`
  const fullPath = basePath + filename

  const code = allCodes[fullPath]
  const html =  codeToHtml(code, {
    lang: 'vue',
    theme: 'nord',
  })

  return {
    preview: allPreviews[fullPath],
    code: html,
  }
}
