/**
 * Changes to make in frappe UI — on hold until the team approves them.
 *
 * Each value here reproduces, from the outside, one change proposed for the
 * frappe-ui components themselves, so the playground shows the proposed look
 * while the library stays untouched. When a change lands in frappe-ui, delete
 * its entry and the bindings that use it; the render should not move.
 */

/**
 * Divider: `outline-gray-2` → `outline-gray-1`, the line colour Espresso uses
 * and the one every other line in these patterns uses. `!` because the
 * library's own colour class sits on the same element.
 */
export const divider = '!border-outline-gray-1'

/**
 * Avatar: the scale stops at 46px (`3xl`), and Espresso's profile avatar is
 * 72px. Proposed as a `4xl` step on the component rather than a class here.
 */
export const avatarProfileSize = '!size-[72px]'

/**
/**
 * A description is 14px type on a 21px line, so it carries ~2.5px of empty
 * leading above and below its ink. A label is 14 on 16 and carries almost
 * none. Mixed in one list, the same 16px gap reads as 15px between two plain
 * rows and 19px after a row that ends in a description. Trimming the
 * description's outer leading makes the gap you set the gap you see.
 */
export const leadingTrim = '[&_[data-slot=description]]:-my-[2px]'

/**
 * Toggle rows — type and spacing, against Espresso's cell:
 *
 *   · control → text is 12px there; Radio and Checkbox both ship 8px
 *   · a row title is 14px medium in ink-gray-8; Radio draws 14px regular in
 *     ink-gray-7 and Checkbox/Switch draw 13px
 *   · a row description is 14/21 in ink-gray-6; Radio draws 13px ink-gray-5
 *     and Checkbox/Switch draw 13px
 *   · title → description is 4px there; Radio ships 2px
 *
 * Three entries rather than one, because a row with a description carries a
 * medium title while a bare row carries a regular one — the same split the
 * design makes.
 */
export const radioRow = [
  '[&_[role=radio]]:gap-3',
  '[&_[data-slot=description]]:tracking-[0.14px]',
  leadingTrim,
  '[&_[role=radio]>span:nth-child(2)]:gap-1',
  '[&_[data-slot=label]]:text-base-medium [&_[data-slot=label]]:text-ink-gray-8',
  '[&_[data-slot=description]]:text-p-base [&_[data-slot=description]]:text-ink-gray-6',
].join(' ')

export const switchRow = [
  '[&_[data-slot=description]]:tracking-[0.14px]',
  leadingTrim,
  // Switch puts 2px between its label and description; Espresso has 4.
  '[&_[data-slot=description]]:mt-[2px]',
  // The description runs the full width and passes under the control; Espresso
  // keeps it in the label's column (32px md control + 12px gap).
  '[&_[data-slot=description]]:pe-[44px]',
  '[&_[data-slot=label]]:text-base-medium [&_[data-slot=label]]:text-ink-gray-8',
  '[&_[data-slot=description]]:text-p-base [&_[data-slot=description]]:text-ink-gray-6',
].join(' ')

export const checkboxRow = [
  '[&_input[type=checkbox]]:me-1',
  '[&_[data-slot=label]]:tracking-[0.21px]',
  '[&_[data-slot=label]]:text-base [&_[data-slot=label]]:text-ink-gray-7',
].join(' ')

/**
 * Switch with no label: the control is 16px, but its wrapper reports 24 — the
 * control sits inline, so an empty line box pads it out. That extra 8px pushes
 * whatever sits under the heading row out of step with the rest of the list.
 */
export const bareSwitch = 'leading-none'

/**
 * Tracking. Espresso letter-spaces its 14px text by 1.5% in a row (0.21px)
 * and by 1% in a description under a title (0.14px); the scale here puts 2%
 * (0.28px) on `text-base` and `text-p-base` alike. `text-base-medium` already
 * carries 0.21, so only the regular weights drift.
 */
export const cellText = 'tracking-[0.21px]'

/**
 * MultiSelect menu, against Espresso's dropdown. None of this is pushed to
 * frappe-ui yet — the team validates the tag and this menu first.
 *
 *   · every row carries a checkbox, hard-coded in MultiSelectResults with no
 *     prop to turn it off; Espresso marks the chosen rows with a check at the
 *     trailing edge instead
 *   · the menu always ends in a Clear All / Select All footer, which Espresso
 *     doesn't draw (passing an empty `#footer` slot is what removes it)
 */
export const multiSelectMenu =
  '[&_[data-slot=item-prefix]>span>div:first-child]:hidden'

/**
 * Password: the reveal toggle doesn't scale with the field.
 *
 * `Password.vue` hard-codes its suffix as a `size-5` button around a
 * `size-3.5` glyph whatever the `size` prop says, so the same 20/14 toggle
 * sits in a 28px `sm` field and a 32px `md` one. Espresso scales it: on the
 * 28px field (node 35220:54178) the button is 24 and the glyph 14 — the
 * button is the field height less 4, and the glyph half the field. On our
 * 32px `md` field that is a 28px button around a 16px glyph.
 *
 * The `md` variant wasn't reachable over REST, so those two numbers are read
 * off the `sm` one's ratios rather than measured directly.
 */
export const passwordToggle = [
  '[&_button]:!size-7',
  '[&_button>span]:!size-4',

  // The field's own padding, from the same node: 8 on the lead, 2 on the
  // tail, and 14 between the text and the toggle.
  //
  // `TextInput` insets the suffix by its size step instead (`pe-2.5`, 10px on
  // md), which leaves the toggle floating well short of the edge. 2px puts it
  // where Espresso draws it. The input's own tail padding then has to clear
  // the button by that 14: 2 + 28 + 14 = 44.
  '[&_.absolute.end-0]:!pe-0.5',
  '[&_input]:!ps-2',
  '[&_input]:!pe-11',
].join(' ')
