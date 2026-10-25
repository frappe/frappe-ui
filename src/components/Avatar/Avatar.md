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

The `#indicator` slot places a dot on the bottom-right corner.

<ComponentPreview name="Avatar-Presence" />

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
initial and the size of the indicator dot. A responsive class like
`sm:size-16` works alongside `size`: `size` sets the width on small screens,
and the class takes over from its breakpoint up.

## Accessibility

The image uses `label` as its alt text.

<!-- @include: ./Avatar.api.md -->
