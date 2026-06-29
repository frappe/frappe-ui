<script>
// Re-export shim: the canonical EmitsTable lives in the shared docs theme
// (frappe-ui/vitepress). Colocated component docs under src/**/*.md
// import it via the @/components/Docs/EmitsTable.vue path, so keep this thin
// alias rather than rewriting every source page.
import { EmitsTable } from 'frappe-ui/vitepress'
export default EmitsTable
</script>
