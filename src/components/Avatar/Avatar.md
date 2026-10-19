# Avatar

Shows a person or a workspace as a photo, or as the first letter of their name
when there is no photo.

<ComponentPlayground name="Avatar" />

## Examples

### Comment thread

A photo when the person has one, and their initial in a theme color when they
do not.

<ComponentPreview name="Avatar-CommentThread" />

### Assignees

Overlapping avatars on a task row. A ring in the page color separates each
avatar from the one under it, and a count stands in for the rest.

<ComponentPreview name="Avatar-Assignees" />

### Online status

Put an `AvatarBadge` in the `#indicator` slot to show a status dot on the
bottom-right corner. A background class on the badge sets its color.

```vue
<Avatar :image :label>
  <template #indicator>
    <AvatarBadge class="bg-surface-green-5" />
  </template>
</Avatar>
```

<ComponentPreview name="Avatar-Presence" />

### Verified badge

Content in an `AvatarBadge`, such as an icon, is centered in the badge. Use a
size with room for it, and give it text for screen readers.

<ComponentPreview name="Avatar-Verified" />

### Workspace switcher

Square avatars stand for workspaces and teams, round ones for people. The
default slot replaces the initial with any content, here an icon.

<ComponentPreview name="Avatar-Workspaces" />

### Profile header

A `size-*` class sets a size beyond the largest `size` step.

<ComponentPreview name="Avatar-ProfileHeader" />

## Behavior

### Fallback

The avatar shows the initial when `image` is empty or the image fails to load.
The initial is the first character of `label`, uppercased, so pass the full
name rather than initials: `label="Jane Cooper"` shows `J`. `theme` colors the
initial and its background. It has no effect on a photo.

### Custom sizes

A sizing class on the avatar (`size-*`, `w-*`, `h-*`) replaces the `size`
prop's width and height. The `size` prop still sets the text size of the
initial and the size of the badge. A responsive class like
`sm:size-16` works alongside `size`: `size` sets the width on small screens,
and the class takes over from its breakpoint up.

### Badge

`AvatarBadge` fills the indicator, so the avatar's `size` prop sets its size
(see [Custom sizes](#custom-sizes)). Without a color class the badge is gray. A
ring cuts the badge out of the avatar.

### Badge ring

The ring has the color of the page surface. When the avatar sits on a different
surface, such as a popover, a dialog or a hovered row, set the
`--avatar-badge-ring` CSS variable to that surface's color. Set it on the
avatar, or on any parent to set every avatar inside it:

```vue
<div
  class="hover:bg-surface-gray-2 hover:[--avatar-badge-ring:var(--surface-gray-2)]"
>
  <Avatar :image :label>…</Avatar>
</div>
```

## Accessibility

The image uses `label` as its alt text.

A badge shows status with color only. Show the status as text next to the
avatar, or put text with the `sr-only` class in the badge.

<!-- @include: ./Avatar.api.md -->
