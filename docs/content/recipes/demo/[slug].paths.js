// One chrome-less demo route per recipe, generated from the slug list so new
// recipes need no hand-written stub. The matching [slug].md carries the
// `recipe-demo` layout; Layout.vue resolves the recipe from the `slug` param.
//
// Imports the vue-free slug list, not the full registry: this loader is bundled
// by esbuild, which can't load the `.vue` files ./index.ts pulls in.
import { recipeSlugs } from '../../../components/recipes/slugs'

export default {
  paths() {
    return recipeSlugs.map((slug) => ({ params: { slug } }))
  },
}
