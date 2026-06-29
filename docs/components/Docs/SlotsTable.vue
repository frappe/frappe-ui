<script>
// Re-export shim: the canonical SlotsTable lives in the shared docs theme
// (frappe-ui/vitepress). Colocated component docs under src/**/*.md
// import it via the @/components/Docs/SlotsTable.vue path, so keep this thin
// alias rather than rewriting every source page.
import { SlotsTable } from 'frappe-ui/vitepress'
export default SlotsTable
</script>
