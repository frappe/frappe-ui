/**
 * @vitest-environment jsdom
 */

import { Renderer } from '@openuidev/vue-lang'
import type { ActionEvent } from '@openuidev/lang-core'
import { describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, reactive } from 'vue'
import { library, promptOptions } from './index'

type Tools = Record<string, (args: Record<string, unknown>) => Promise<unknown>>

function render(
  response: string,
  options: { tools?: Tools; onAction?: (event: ActionEvent) => void } = {},
) {
  const state = reactive({ response, isStreaming: false })
  const host = document.createElement('div')
  const app = createApp(() =>
    h(Renderer, {
      library,
      response: state.response,
      isStreaming: state.isStreaming,
      toolProvider: options.tools ?? null,
      onAction: options.onAction,
    }),
  )
  app.mount(host)
  return { host, state, unmount: () => app.unmount() }
}

async function settle() {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve))
    await nextTick()
  }
}

describe('frappe-ui OpenUI library', () => {
  it('renders a program with frappe-ui components and live Query rows', async () => {
    const getList = vi.fn(async () => [
      { name: 'T-1', subject: 'Checkout times out', priority: 'Urgent' },
      { name: 'T-2', subject: 'PDF export is blank', priority: 'Low' },
    ])
    const { host, unmount } = render(
      `root = Stack([title, kpis, list])
title = Heading("Open tickets")
tickets = Query("get_list", { doctype: "HD Ticket", filters: { status: "Open" } }, [])
kpis = Row([NumberCard("Open", @Count(tickets)), NumberCard("Urgent", @Count(@Filter(tickets, "priority", "==", "Urgent")))])
list = List(@Each(tickets, "t", ListRow(t.subject, t.name, Badge(t.priority, t.priority == "Urgent" ? "red" : "gray"))))`,
      { tools: { get_list: getList } },
    )
    await settle()

    expect(getList).toHaveBeenCalledWith({
      doctype: 'HD Ticket',
      filters: { status: 'Open' },
    })
    const text = host.textContent ?? ''
    expect(host.querySelector('h2')?.textContent).toBe('Open tickets')
    expect(text).toContain('Checkout times out')
    expect(text).toContain('PDF export is blank')
    expect(text).toContain('Urgent')
    // NumberCard counts up to its value, so only check that both cards render.
    expect(host.querySelectorAll('[data-slot="chart-card"]')).toHaveLength(2)
    unmount()
  })

  it('renders the finished lines of a program that is still streaming', async () => {
    const { host, state, unmount } = render(
      `root = Stack([title, note])
title = Heading("Weekly summary")
note = Text("Three releases`,
    )
    state.isStreaming = true
    await settle()
    expect(host.textContent).toContain('Weekly summary')

    state.response += ' shipped.")'
    state.isStreaming = false
    await settle()
    expect(host.textContent).toContain('Three releases shipped.')
    unmount()
  })

  it('sends a button action to the app', async () => {
    const onAction = vi.fn()
    const { host, unmount } = render(
      `root = Stack([actions])
actions = Buttons([Button("Summarize", Action([@ToAssistant("Summarize the urgent tickets")]), "solid")])`,
      { onAction },
    )
    await settle()

    host.querySelector('button')?.click()
    await settle()
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'continue_conversation',
        humanFriendlyMessage: 'Summarize the urgent tickets',
      }),
    )
    unmount()
  })

  it('teaches the model every component and leaves out inputs', () => {
    const prompt = library.prompt({ ...promptOptions, tools: ['get_list'] })
    for (const name of Object.keys(library.components)) {
      expect(prompt).toContain(`${name}(`)
    }
    expect(prompt).toContain(
      'Badge(label: string | number, theme?: "gray" | "blue" | "green" | "amber" | "red" | "violet"',
    )
    expect(prompt).not.toContain('## Forms')
  })
})
