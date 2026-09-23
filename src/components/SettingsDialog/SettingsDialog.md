# SettingsDialog

A dialog for app settings, with a sidebar of grouped tabs on the left and the
selected tab's content on the right.

<ComponentPreview name="SettingsDialog-Default" layout="stacked" />

## Anatomy

`SettingsDialog` is built on `Dialog` and is made of small parts rather than a
config object. Give each nav item and its panel the same `value`.

```vue
<SettingsDialog v-model:open="open" v-model:tab="tab">
  <SettingsSidebar>
    <SettingsNavGroup label="User settings">
      <SettingsNavItem value="profile">
        <template #prefix><Avatar size="xs" label="Alex Rivera" /></template>
        Profile
      </SettingsNavItem>
      <SettingsNavItem value="notifications">Notifications</SettingsNavItem>
    </SettingsNavGroup>
  </SettingsSidebar>

  <SettingsContent>
    <SettingsPanel value="profile">…</SettingsPanel>
    <SettingsPanel value="notifications">
      <SettingsHeader title="Notifications" />
      <SettingsBody>
        <SettingsRow title="Email digests" description="A summary of missed activity.">
          <Switch v-model="digest" />
        </SettingsRow>
      </SettingsBody>
    </SettingsPanel>
  </SettingsContent>
</SettingsDialog>
```

- `SettingsDialog` holds the open state (`v-model:open`), the selected tab
  (`v-model:tab`) and the keyboard shortcut.
- `SettingsSidebar`, `SettingsNavGroup` and `SettingsNavItem` are the
  navigation. A nav item takes `#prefix` and `#suffix`.
- `SettingsContent` and `SettingsPanel` are the right side, with one panel per
  tab.
- `SettingsHeader`, `SettingsBody` and `SettingsRow` lay out a panel.

## Examples

### Notification settings

A panel with a `SettingsHeader` that stays in place, a `SettingsBody` that
scrolls, and one `SettingsRow` per setting.

<ComponentPreview name="SettingsDialog-PanelBasic" />

## Behavior

### Selected tab

The selected tab is the `value` of a nav item, not an `active` flag.
`v-model:tab` is optional. Bind it to drive the selection yourself, for example
from a `/settings/:tab` URL. Left unbound, the dialog tracks the selection
itself.

### Keeping panels mounted

A panel's content is unmounted when its tab is not selected. Set
`:unmount-on-hide="false"` to keep visited panels mounted, so they keep their
state and scroll position across tab switches.

### Keyboard shortcut

`Cmd+Shift+,` (`Ctrl+Shift+,` on Windows and Linux) opens and closes the dialog,
even while focus is in an input. Pass another combo to `keyboardShortcut` to
change it, or `false` to turn it off.

### Size and mobile layout

The dialog fills the screen on mobile, with the sidebar above the content. On
desktop it is a centered panel. `size` sets its maximum width and takes the
same values as `Dialog`'s `size`.

### Panel header and body

Put a `SettingsHeader` and a `SettingsBody` in each `SettingsPanel`. The header
stays in place and the body scrolls, so titles, search inputs and column
headers never scroll away. `SettingsHeader` takes `title`, `description` and an
`#actions` slot, or any content in its default slot.

### Setting rows

`SettingsRow` shows a setting's title and description on the left and its
control on the right. When the control is a frappe-ui control such as `Switch`,
the title becomes its `<label>`, with no `label-for` needed. Set `labelFor` to
point the label at another element's id.

## Accessibility

The dialog is a tab set: the sidebar has the `tablist` role, each nav item the
`tab` role, and each panel the `tabpanel` role.

| Key                     | Action                                     |
| ----------------------- | ------------------------------------------ |
| `ArrowDown` / `ArrowUp` | Move focus to the next or previous tab     |
| `Enter` / `Space`       | Select the focused tab                     |
| `Cmd/Ctrl+Shift+,`      | Open or close the dialog                   |

Arrow keys move focus without selecting a tab, so a dialog that drives its tab
from the route does not navigate on every key press.

The dialog has a visually hidden title, "Settings", and a hidden description.
Replace them with the `#title` and `#description` slots.

## Migrating from v0

The open state moves from the unnamed `v-model` to `v-model:open`. This break
is silent: the dialog never opens. The `shortcut` prop is now
`keyboardShortcut`. See the [migration guide](../migration#settingsdialog).

<!-- @include: ./SettingsDialog.api.md -->
