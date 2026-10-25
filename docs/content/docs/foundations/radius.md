<script setup>
import RadiusPage from '@/components/foundations/RadiusPage.vue'
</script>

# Radius

A corner radius scale from square to fully round.

<RadiusPage />

## Usage

Write the step number after `rounded-`, as in `rounded-4`. Tailwind's named
sizes, such as `rounded-lg`, and the bare `rounded` class are not available.

Larger elements get larger corners. In frappe-ui components:

| Class | Used on |
| --- | --- |
| `rounded-4` (8px) | Buttons, inputs and menu items |
| `rounded-6` (12px) | Menus |
| `rounded-7` (16px) | Dialogs |
| `rounded-full` | Badges and round avatars |

Each step is also a CSS variable, as in `var(--radius-4)`.
