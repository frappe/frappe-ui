# States

Every chart handles the same three states: `loading`, `error` (a message
string), and empty — which is a data state, not a flag, so the chart decides it
has nothing to draw. `dir` forces the layout direction; it defaults to
`document.documentElement.dir`.

<ComponentPreview name="Charts-States" csr="true" wide self-layout />
