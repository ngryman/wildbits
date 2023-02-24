import { render } from 'solid-js/web'
import { ThemeProvider } from 'solid-styled-components'

import { NotesProvider, type Note } from 'contexts/notes'
import { schema } from 'editor/schema'

import App from './App'
import GlobalStyles from './GlobalStyles'

const theme = {}

const initialNotes: Note[] = [
  {
    from: 18,
    to: 106,
    doc: schema.node('doc', null, [
      schema.node(
        'paragraph',
        null,
        schema.text(`Probably elaborate on why monotony sucks balls.`)
      ),
    ]),
  },
  {
    from: 231,
    to: 288,
    doc: schema.node('doc', null, [
      schema.node('paragraph', null, schema.text(`This is my second note.`)),
    ]),
  },
]

render(
  () => (
    <ThemeProvider theme={theme}>
      <NotesProvider notes={initialNotes}>
        <GlobalStyles />
        <App />
      </NotesProvider>
    </ThemeProvider>
  ),
  document.body
)
