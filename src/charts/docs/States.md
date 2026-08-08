---
# The preview on this page is `wide`, which needs the OnThisPage aside gone.
outline: false
---

# States

Every chart draws the same three states, and you get them for free. Set
`loading` while the query runs. Set `error` to a message when it fails. Pass no
rows and the chart reports that it has nothing to draw — empty is a data state,
not a flag.

The overlay belongs to the chart card, so a loading donut and a loading heatmap
look alike. `NumberCard` differs: it skeletons the reading in place. `dir`
forces the layout direction; it defaults to `document.documentElement.dir`.

<ComponentPreview name="Charts-States" csr="true" wide self-layout />
