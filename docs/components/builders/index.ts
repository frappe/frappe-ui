import type { App } from 'vue'

// Opt-in showcase machinery: the *Builder.vue playgrounds + ComponentPlayground.
// Import this only on sites that document frappe-ui components themselves.
import ComponentPlayground from './ComponentPlayground.vue'
import AlertBuilder from './AlertBuilder.vue'
import AvatarBuilder from './AvatarBuilder.vue'
import BadgeBuilder from './BadgeBuilder.vue'
import BreadcrumbsBuilder from './BreadcrumbsBuilder.vue'
import ButtonBuilder from './ButtonBuilder.vue'
import CheckboxBuilder from './CheckboxBuilder.vue'
import CodeEditorBuilder from './CodeEditorBuilder.vue'
import ComboboxBuilder from './ComboboxBuilder.vue'
import DialogBuilder from './DialogBuilder.vue'
import DividerBuilder from './DividerBuilder.vue'
import DropdownBuilder from './DropdownBuilder.vue'
import DurationBuilder from './DurationBuilder.vue'
import ErrorMessageBuilder from './ErrorMessageBuilder.vue'
import FormControlBuilder from './FormControlBuilder.vue'
import MultiSelectBuilder from './MultiSelectBuilder.vue'
import PasswordBuilder from './PasswordBuilder.vue'
import ProgressBuilder from './ProgressBuilder.vue'
import RatingBuilder from './RatingBuilder.vue'
import SelectBuilder from './SelectBuilder.vue'
import SliderBuilder from './SliderBuilder.vue'
import SwitchBuilder from './SwitchBuilder.vue'
import TabButtonsBuilder from './TabButtonsBuilder.vue'
import TabsBuilder from './TabsBuilder.vue'
import TextInputBuilder from './TextInputBuilder.vue'
import TextareaBuilder from './TextareaBuilder.vue'
import TooltipBuilder from './TooltipBuilder.vue'

export const builders = {
  AlertBuilder,
  AvatarBuilder,
  BadgeBuilder,
  BreadcrumbsBuilder,
  ButtonBuilder,
  CheckboxBuilder,
  CodeEditorBuilder,
  ComboboxBuilder,
  DialogBuilder,
  DividerBuilder,
  DropdownBuilder,
  DurationBuilder,
  ErrorMessageBuilder,
  FormControlBuilder,
  MultiSelectBuilder,
  PasswordBuilder,
  ProgressBuilder,
  RatingBuilder,
  SelectBuilder,
  SliderBuilder,
  SwitchBuilder,
  TabButtonsBuilder,
  TabsBuilder,
  TextInputBuilder,
  TextareaBuilder,
  TooltipBuilder,
}

// Register every builder globally so markdown can reference them by name.
export function registerBuilders(app: App) {
  for (const [name, component] of Object.entries(builders)) {
    app.component(name, component)
  }
}

export {
  ComponentPlayground,
  AlertBuilder,
  AvatarBuilder,
  BadgeBuilder,
  BreadcrumbsBuilder,
  ButtonBuilder,
  CheckboxBuilder,
  CodeEditorBuilder,
  ComboboxBuilder,
  DialogBuilder,
  DividerBuilder,
  DropdownBuilder,
  DurationBuilder,
  ErrorMessageBuilder,
  FormControlBuilder,
  MultiSelectBuilder,
  PasswordBuilder,
  ProgressBuilder,
  RatingBuilder,
  SelectBuilder,
  SliderBuilder,
  SwitchBuilder,
  TabButtonsBuilder,
  TabsBuilder,
  TextInputBuilder,
  TextareaBuilder,
  TooltipBuilder,
}

export type { Knob, KnobOption } from './ComponentPlayground.vue'
