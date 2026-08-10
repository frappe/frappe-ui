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
look alike. A loading chart draws a skeleton the size of its plot rather than a
spinner in the middle of it: a dashboard fills in a card at a time, and a
placeholder holding the grid's shape reads as one card arriving instead of eight
spinners turning out of step. `NumberCard` has no plot and skeletons its reading
the same way. `dir` forces the layout direction; it defaults to
`document.documentElement.dir`.

<ComponentPreview name="Charts-States" csr="true" wide self-layout />

## Taking over a state

Each state is a slot — `#loading`, `#error` and `#empty` — on every chart in
the family. Replace one and the rest of the chrome stays where it was, so a
failed query gets a retry button beside its message without the app drawing its
own card, title block and legend to hold it. `#error` carries the message as a
slot prop.

<ComponentPreview name="Charts-StatesRecovery" csr="true" wide self-layout />

`#loading` replaces the whole placeholder rather than a caption under a spinner,
so an app whose card has a shape worth holding can draw that shape. Reach for it
when the library's block is wrong for the card. The default is what keeps a
dashboard from filling in eight different ways.
