<script>
// Re-export shim: the canonical PropsTable lives in the shared docs theme
// (frappe-ui/vitepress). Colocated component docs under src/**/*.md
// import it via the @/components/Docs/PropsTable.vue path, so keep this thin
// alias rather than rewriting every source page.
import { PropsTable } from 'frappe-ui/vitepress'
export default PropsTable
</script>
