# Radio

A set of options where people pick exactly one. For a few options shown as
buttons, use [TabButtons](./tabbuttons).

<ComponentPlayground name="Radio" />

## Anatomy

`RadioGroup` holds the selected value and the group's label, description and
error. Each `Radio` inside it sets the `value` it stands for.

```vue
<RadioGroup v-model="plan" label="Choose a plan">
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" description="For growing teams." />
</RadioGroup>
```

## Examples

### Choose a plan

`required` on `RadioGroup` puts the asterisk on the group label.

<ComponentPreview name="Radio-Required" />

### Notification settings

`padded` makes each option a row with a clickable surface. A `description`
shows below the label, and one option is `disabled`.

<ComponentPreview name="Radio-SettingsList" />

## Behavior

### Inside a group

`Radio` must be inside a `RadioGroup`, and throws an error otherwise. The
group handles arrow keys, focus and form submission, so each option needs only
a `value`.

### Value

A value can be a `string`, `number` or `boolean`. The model is `undefined`
while nothing is selected, which is where an unbound group starts.

### Group props

`required` and `error` are set on `RadioGroup` only, because they describe the
whole choice, not one option. `size` and `padded` are also set on the group
and apply to every option. `disabled` on the group disables every option, and
`disabled` on a `Radio` disables that option only.

### Orientation

`orientation` is `vertical` by default. `horizontal` lays the options in a row
and switches the arrow keys to left and right. `loop` is `true` by default, so
the arrow keys go from the last option back to the first.

### Form submission

The group submits its value with a form. `name` sets the field name. Without
it, a name is generated.

### Attributes

`class` and `style` go to the layout wrapper. Everything else (`name`,
`aria-*`, `data-*` and listeners) goes once to the interactive element, which
for `RadioGroup` is the radio group itself.

## Accessibility

`RadioGroup` renders an element with `role="radiogroup"`, labelled by the
group label. Each `Radio` renders a `role="radio"` button that covers the
label and description.

| Keys                    | Action                                           |
| ----------------------- | ------------------------------------------------ |
| `Tab`                   | Move focus into the group, to the selected option |
| `ArrowDown` / `ArrowUp` | Select the next or previous option (vertical)    |
| `ArrowRight` / `ArrowLeft` | Select the next or previous option (horizontal) |

While `error` is set, the group gets `aria-invalid` and an
`aria-errormessage` that points to the error text.

## Migrating from v0

Attributes used to go to the wrapper. Now they go to the radio group. See the
[migration guide](/docs/migration#inputs-attrs) for details.

<!-- @include: ./Radio.api.md -->
