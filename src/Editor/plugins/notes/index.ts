import { createRoot } from 'solid-js'
import { Plugin } from 'prosemirror-state'

import { useNotes, type NoteStore } from 'contexts/notes'

import { createState, type HiddenState } from './state'
import { createPluginProps, createPluginView } from './plugin'

const initialState: HiddenState = {
  mode: 'hidden',
}

export function note(): Plugin<NoteStore> {
  return createRoot(dispose => {
    const state = createState(initialState)
    const notes = useNotes()

    return new Plugin({
      view: view => createPluginView(view, state, notes, dispose),
      props: createPluginProps(state, notes),
    })
  })
}
