<script>
// Re-export shim: the canonical ExposedTable lives in the shared docs theme
// (frappe-ui/vitepress). Colocated component docs under src/**/*.md
// import it via the @/components/Docs/ExposedTable.vue path, so keep this thin
// alias rather than rewriting every source page.
import { ExposedTable } from 'frappe-ui/vitepress'
export default ExposedTable
</script>
