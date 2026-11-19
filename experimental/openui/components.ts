import { h, type VNode } from 'vue'
import {
  defineComponent,
  tagSchemaId,
  useIsStreaming,
  useTriggerAction,
  type ActionConfig,
  type ComponentRenderProps,
} from '@openuidev/vue-lang'
import { z } from 'zod/v4'
import { Alert } from '../../src/components/Alert'
import { Badge } from '../../src/components/Badge'
import { Button } from '../../src/components/Button'
import { BarChart, DonutChart, LineChart, NumberCard } from '../../src/charts'
import { List, ListCell, ListRow } from '../../src/molecules/list'

// Each definition below is one OpenUI component: a model calls it by `name`,
// with arguments in the key order of `props`. The descriptions go into the
// system prompt, so they tell the model when to use the component.

// An `Action([...])` expression. The tag gives it a readable type name in the
// prompt and turns on the prompt's section about actions.
const action = z.any()
tagSchemaId(action, 'ActionExpression')

// Rows from a `Query`, or an array literal the model writes.
const rows = z.array(z.record(z.string(), z.any()))

export const StackNode = defineComponent({
  name: 'Stack',
  description:
    'Puts its children in a column. Use it as the root of every response.',
  props: z.object({
    children: z.array(z.any()),
  }),
  component: ({ props, renderNode }: Render<{ children: unknown[] }>) =>
    h('div', { class: 'flex flex-col gap-4' }, [renderNode(props.children)]),
})

export const RowNode = defineComponent({
  name: 'Row',
  description:
    'Puts its children side by side in equal columns. Use it for 2 to 4 NumberCards or charts.',
  props: z.object({
    children: z.array(z.any()),
  }),
  component: ({ props, renderNode }: Render<{ children: unknown[] }>) =>
    h('div', { class: 'grid grid-flow-col auto-cols-fr gap-3' }, [
      renderNode(props.children),
    ]),
})

export const HeadingNode = defineComponent({
  name: 'Heading',
  description: 'A section title.',
  props: z.object({
    text: z.string(),
  }),
  component: ({ props }: Render<{ text: string }>) =>
    h('h2', { class: 'text-lg-semibold text-ink-gray-9' }, props.text),
})

export const TextNode = defineComponent({
  name: 'Text',
  description: 'A paragraph of plain text.',
  props: z.object({
    text: z.string(),
  }),
  component: ({ props }: Render<{ text: string }>) =>
    h('p', { class: 'text-p-base text-ink-gray-7' }, props.text),
})

const badgeProps = z.object({
  label: z.union([z.string(), z.number()]),
  theme: z
    .enum(['gray', 'blue', 'green', 'amber', 'red', 'violet'])
    .optional()
    .describe('red: urgent or failed, amber: warning, green: done'),
  variant: z.enum(['solid', 'subtle', 'outline', 'ghost']).optional(),
})

export const BadgeNode = defineComponent({
  name: 'Badge',
  description: 'A short status label, such as a priority or a state.',
  props: badgeProps,
  component: ({ props }: Render<z.infer<typeof badgeProps>>) =>
    h(Badge, {
      label: props.label,
      theme: props.theme,
      variant: props.variant ?? 'subtle',
    }),
})

const alertProps = z.object({
  title: z.string(),
  description: z.string().optional(),
  theme: z.enum(['gray', 'blue', 'green', 'amber', 'red']).optional(),
})

export const AlertNode = defineComponent({
  name: 'Alert',
  description:
    'A message that needs attention: a warning, an error, or a success note.',
  props: alertProps,
  component: ({ props }: Render<z.infer<typeof alertProps>>) =>
    h(Alert, {
      title: props.title,
      description: props.description,
      theme: props.theme,
    }),
})

const buttonProps = z.object({
  label: z.string(),
  action: action.optional(),
  variant: z
    .enum(['solid', 'subtle', 'outline', 'ghost'])
    .optional()
    .describe('solid for the main action, subtle for the others'),
  theme: z.enum(['gray', 'blue', 'green', 'red']).optional(),
})

export const ButtonNode = defineComponent({
  name: 'Button',
  description: 'A button that runs an action when clicked.',
  props: buttonProps,
  component: {
    props: ['props', 'renderNode'],
    setup(p: Render<z.infer<typeof buttonProps>>) {
      const triggerAction = useTriggerAction()
      const isStreaming = useIsStreaming()
      return () =>
        h(Button, {
          label: p.props.label,
          variant: p.props.variant,
          theme: p.props.theme,
          disabled: isStreaming.value,
          onClick: () =>
            triggerAction(
              p.props.label,
              undefined,
              p.props.action as ActionConfig | undefined,
            ),
        })
    },
  },
})

export const ButtonsNode = defineComponent({
  name: 'Buttons',
  description: 'A row of Buttons.',
  props: z.object({
    buttons: z.array(ButtonNode.ref),
  }),
  component: ({ props, renderNode }: Render<{ buttons: unknown[] }>) =>
    h('div', { class: 'flex flex-wrap gap-2' }, [renderNode(props.buttons)]),
})

const numberCardProps = z.object({
  title: z.string(),
  value: z.union([z.number(), z.string()]),
  prefix: z.string().optional().describe('Printed before the value, e.g. "$"'),
  suffix: z.string().optional().describe('Printed after the value, e.g. "%"'),
  delta: z
    .number()
    .optional()
    .describe('Change against the previous period. Its sign sets the arrow.'),
})

export const NumberCardNode = defineComponent({
  name: 'NumberCard',
  description: 'One number with a title, such as a count or a total.',
  props: numberCardProps,
  component: ({ props }: Render<z.infer<typeof numberCardProps>>) =>
    h(NumberCard, {
      title: props.title,
      value: props.value ?? null,
      prefix: props.prefix,
      suffix: props.suffix,
      delta: props.delta,
    }),
})

const axisChartProps = z.object({
  data: rows,
  x: z.string().describe('Key of the category or date in each row'),
  y: z
    .union([z.string(), z.array(z.string())])
    .describe('Key, or keys, of the numbers in each row'),
  title: z.string().optional(),
})

const barChartProps = axisChartProps.extend({
  stacked: z.boolean().optional(),
  horizontal: z.boolean().optional().describe('Use for long category names'),
})

export const BarChartNode = defineComponent({
  name: 'BarChart',
  description:
    'Compares numbers across categories. Pass Query rows as data; do not copy numbers into the program.',
  props: barChartProps,
  component: ({ props }: Render<z.infer<typeof barChartProps>>) =>
    chartBox(
      h(BarChart, {
        data: props.data ?? [],
        x: props.x,
        y: props.y,
        title: props.title,
        stacked: props.stacked,
        horizontal: props.horizontal,
      }),
    ),
})

export const LineChartNode = defineComponent({
  name: 'LineChart',
  description: 'Shows how numbers change over time.',
  props: axisChartProps,
  component: ({ props }: Render<z.infer<typeof axisChartProps>>) =>
    chartBox(
      h(LineChart, {
        data: props.data ?? [],
        x: props.x,
        y: props.y,
        title: props.title,
      }),
    ),
})

const donutChartProps = z.object({
  data: rows,
  category: z.string().describe('Key of the slice name in each row'),
  value: z.string().describe('Key of the slice size in each row'),
  title: z.string().optional(),
})

export const DonutChartNode = defineComponent({
  name: 'DonutChart',
  description: 'Shows how a whole splits into parts. Use for 2 to 6 parts.',
  props: donutChartProps,
  component: ({ props }: Render<z.infer<typeof donutChartProps>>) =>
    chartBox(
      h(DonutChart, {
        data: props.data ?? [],
        category: props.category,
        value: props.value,
        title: props.title,
      }),
    ),
})

const listRowProps = z.object({
  title: z.string(),
  description: z.string().optional(),
  aside: z
    .any()
    .optional()
    .describe('Shown at the end of the row: text or a Badge'),
})

export const ListRowNode = defineComponent({
  name: 'ListRow',
  description: 'One row of a List.',
  props: listRowProps,
  component: ({ props, renderNode }: Render<z.infer<typeof listRowProps>>) =>
    h(ListRow, null, () => [
      h(ListCell, null, () =>
        h('div', { class: 'min-w-0 py-2' }, [
          h(
            'div',
            { class: 'truncate text-base text-ink-gray-8' },
            props.title,
          ),
          props.description
            ? h(
                'div',
                { class: 'mt-1 truncate text-base text-ink-gray-5' },
                props.description,
              )
            : null,
        ]),
      ),
      h(ListCell, { class: 'justify-end text-sm text-ink-gray-5' }, () =>
        renderNode(props.aside),
      ),
    ]),
})

export const ListNode = defineComponent({
  name: 'List',
  description: 'A list of records. Build the rows with @Each over Query rows.',
  props: z.object({
    rows: z.array(ListRowNode.ref),
  }),
  component: ({ props, renderNode }: Render<{ rows: unknown[] }>) =>
    h(List, { columns: ['minmax(0,1fr)', 'auto'] }, () =>
      renderNode(props.rows),
    ),
})

type Render<P> = ComponentRenderProps<P>

// A chart fills the box it is in, and a box with no height shows nothing.
function chartBox(chart: VNode) {
  return h('div', { class: 'h-72 w-full' }, [chart])
}
