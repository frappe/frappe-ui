import type { Theme } from 'vitepress'
import '../../../src/fonts/Inter/inter.css'
import '../../css/style.css'
import '../../css/shiki.css'
import Demo from '../../components/Docs/Demo.vue'
import ButtonBuilder from '../../components/Docs/ButtonBuilder.vue'
import BadgeBuilder from '../../components/Docs/BadgeBuilder.vue'
import PillBuilder from '../../components/Docs/PillBuilder.vue'
import TabButtonsBuilder from '../../components/Docs/TabButtonsBuilder.vue'
import AlertBuilder from '../../components/Docs/AlertBuilder.vue'
import AvatarBuilder from '../../components/Docs/AvatarBuilder.vue'
import BreadcrumbsBuilder from '../../components/Docs/BreadcrumbsBuilder.vue'
import CheckboxBuilder from '../../components/Docs/CheckboxBuilder.vue'
import ComboboxBuilder from '../../components/Docs/ComboboxBuilder.vue'
import DialogBuilder from '../../components/Docs/DialogBuilder.vue'
import DividerBuilder from '../../components/Docs/DividerBuilder.vue'
import DropdownBuilder from '../../components/Docs/DropdownBuilder.vue'
import ErrorMessageBuilder from '../../components/Docs/ErrorMessageBuilder.vue'
import FormControlBuilder from '../../components/Docs/FormControlBuilder.vue'
import MultiSelectBuilder from '../../components/Docs/MultiSelectBuilder.vue'
import PasswordBuilder from '../../components/Docs/PasswordBuilder.vue'
import ProgressBuilder from '../../components/Docs/ProgressBuilder.vue'
import RatingBuilder from '../../components/Docs/RatingBuilder.vue'
import SelectBuilder from '../../components/Docs/SelectBuilder.vue'
import SliderBuilder from '../../components/Docs/SliderBuilder.vue'
import SwitchBuilder from '../../components/Docs/SwitchBuilder.vue'
import TabsBuilder from '../../components/Docs/TabsBuilder.vue'
import TextInputBuilder from '../../components/Docs/TextInputBuilder.vue'
import TextareaBuilder from '../../components/Docs/TextareaBuilder.vue'
import TooltipBuilder from '../../components/Docs/TooltipBuilder.vue'
import Layout from '../../components/Layout.vue'

if (process.env.NODE_ENV === 'production') {
  import.meta.glob('../components/**/stories/*.vue', { eager: true })
}

export default {
  Layout,
  enhanceApp({ app, router, siteData }) {
    app.component('ComponentPreview', Demo)
    app.component('ButtonBuilder', ButtonBuilder)
    app.component('BadgeBuilder', BadgeBuilder)
    app.component('PillBuilder', PillBuilder)
    app.component('TabButtonsBuilder', TabButtonsBuilder)
    app.component('AlertBuilder', AlertBuilder)
    app.component('AvatarBuilder', AvatarBuilder)
    app.component('BreadcrumbsBuilder', BreadcrumbsBuilder)
    app.component('CheckboxBuilder', CheckboxBuilder)
    app.component('ComboboxBuilder', ComboboxBuilder)
    app.component('DialogBuilder', DialogBuilder)
    app.component('DividerBuilder', DividerBuilder)
    app.component('DropdownBuilder', DropdownBuilder)
    app.component('ErrorMessageBuilder', ErrorMessageBuilder)
    app.component('FormControlBuilder', FormControlBuilder)
    app.component('MultiSelectBuilder', MultiSelectBuilder)
    app.component('PasswordBuilder', PasswordBuilder)
    app.component('ProgressBuilder', ProgressBuilder)
    app.component('RatingBuilder', RatingBuilder)
    app.component('SelectBuilder', SelectBuilder)
    app.component('SliderBuilder', SliderBuilder)
    app.component('SwitchBuilder', SwitchBuilder)
    app.component('TabsBuilder', TabsBuilder)
    app.component('TextInputBuilder', TextInputBuilder)
    app.component('TextareaBuilder', TextareaBuilder)
    app.component('TooltipBuilder', TooltipBuilder)
  },
} satisfies Theme
