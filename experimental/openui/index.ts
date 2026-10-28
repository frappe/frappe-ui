import { createLibrary, type PromptOptions } from '@openuidev/vue-lang'
import {
  AlertNode,
  BadgeNode,
  BarChartNode,
  ButtonNode,
  ButtonsNode,
  DonutChartNode,
  HeadingNode,
  LineChartNode,
  ListNode,
  ListRowNode,
  NumberCardNode,
  RowNode,
  StackNode,
  TextNode,
} from './components'

/**
 * frappe-ui components a model can use in OpenUI Lang. Pass it to
 * `<Renderer>` from `@openuidev/vue-lang`, and build the system prompt with
 * `library.prompt(promptOptions)`.
 */
export const library = createLibrary({
  root: 'Stack',
  components: [
    StackNode,
    RowNode,
    HeadingNode,
    TextNode,
    BadgeNode,
    AlertNode,
    ButtonNode,
    ButtonsNode,
    NumberCardNode,
    BarChartNode,
    LineChartNode,
    DonutChartNode,
    ListNode,
    ListRowNode,
  ],
  componentGroups: [
    { name: 'Layout', components: ['Stack', 'Row'] },
    { name: 'Content', components: ['Heading', 'Text', 'Badge', 'Alert'] },
    { name: 'Actions', components: ['Button', 'Buttons'] },
    {
      name: 'Data',
      components: [
        'NumberCard',
        'BarChart',
        'LineChart',
        'DonutChart',
        'List',
        'ListRow',
      ],
    },
  ],
})

/**
 * Rules and examples for `library.prompt()`. Spread them and add the app's
 * own `preamble` and `tools`.
 */
export const promptOptions: PromptOptions = {
  // The library has no inputs, so leave out the prompt's sections on
  // $variables, filters and forms.
  bindings: false,
  additionalRules: [
    'Fetch records with Query and pass the rows to charts and lists. Do not copy numbers into the program.',
    'Use theme for meaning only: red for urgent or failed, amber for warnings, green for done. Use gray otherwise.',
    'Give a screen at most one Button with variant "solid".',
  ],
  examples: [
    `root = Stack([title, summary, actions])
title = Heading("Release checklist")
summary = Text("Two of five steps are done.")
actions = Buttons([Button("Show the open steps", Action([@ToAssistant("Show the open steps")]), "solid")])`,
  ],
  toolExamples: [
    `root = Stack([title, kpis, chart, list])
title = Heading("Open tasks")
tasks = Query("list_tasks", { status: "Open" }, [])
byPriority = Query("count_tasks", { status: "Open", group_by: "priority" }, [])
kpis = Row([NumberCard("Open", @Count(tasks)), NumberCard("High priority", @Count(@Filter(tasks, "priority", "==", "High")))])
chart = BarChart(byPriority, "priority", "count", "By priority")
list = List(@Each(tasks, "t", ListRow(t.description, t.name, Badge(t.priority, t.priority == "High" ? "red" : "gray"))))`,
  ],
}
