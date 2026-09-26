/**
 * @vitest-environment jsdom
 *
 * The barrel is the frozen surface: every name here is owned until `2.0.0`
 * (PHILOSOPHY.md, P13 and P15). The list below is `spec/code-editor.md`'s
 * "Public surface" block, so a new export has to be added in both places.
 */

import { describe, it, expect } from 'vitest'
import * as codeEditor from './index'

/** The runtime half of the spec's "Public surface" block. Types erase. */
const PUBLIC_SURFACE = [
  // Engine
  'useCodeEditor',
  // Components
  'CodeEditor',
  'CodeEditorContent',
  // Kit
  'CodeKit',
  // Individual extensions
  'codeChrome',
  'codeHighlight',
  'codeKeymap',
  // Languages
  'loadLanguage',
]

describe('code-editor barrel', () => {
  it('publishes exactly the names the spec lists', () => {
    expect(Object.keys(codeEditor).sort()).toEqual([...PUBLIC_SURFACE].sort())
  })

  it('exports each name as the kind the spec documents', () => {
    expect(typeof codeEditor.useCodeEditor).toBe('function')
    expect(typeof codeEditor.loadLanguage).toBe('function')
    expect(codeEditor.CodeEditor).toBeTruthy()
    expect(codeEditor.CodeEditorContent).toBeTruthy()
    expect(codeEditor.CodeKit).toBeTruthy()
    expect(typeof codeEditor.CodeKit.configure).toBe('function')
    expect(codeEditor.codeChrome).toBeTruthy()
    expect(codeEditor.codeHighlight).toBeTruthy()
    expect(codeEditor.codeKeymap).toBeTruthy()
  })

  it('re-exports nothing from CodeMirror', () => {
    // A consumer imports these from `@codemirror/state` and `@codemirror/view`,
    // which this subpath already puts in their tree. Re-exporting them would
    // freeze CodeMirror's own names into frappe-ui's surface.
    for (const name of [
      'Extension',
      'EditorView',
      'EditorState',
      'Compartment',
      'basicSetup',
      'placeholder',
      'keymap',
      'StateEffect',
    ]) {
      expect(codeEditor).not.toHaveProperty(name)
    }
  })

  it('keeps the internals out: the context key and the chrome class stay private', () => {
    for (const name of [
      'CodeEditorContextKey',
      'provideCodeEditor',
      'useResolvedCodeEditor',
      'CODE_CHROME_CLASS',
      'diffDocument',
    ]) {
      expect(codeEditor).not.toHaveProperty(name)
    }
  })
})
