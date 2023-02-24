import { createEffect, type JSX } from 'solid-js'
import { EditorView } from 'prosemirror-view'

import { NoteStore } from 'contexts/notes'

import { Container } from '../components'
import { StateContext, type StateStore } from '../state'

export function createPluginView(
  view: EditorView,
  state: StateStore,
  notes: NoteStore,
  destroy: VoidFunction
) {
  createEffect(prevLength => {
    if (prevLength !== notes.length) {
      view.updateState(view.state)
    }
  }, notes.length)

  const dom = (
    <StateContext.Provider value={state}>
      <Container />
    </StateContext.Provider>
  ) as JSX.FunctionElement
  view.dom.parentNode?.insertBefore(dom() as HTMLElement, view.dom)

  return {
    destroy,
  }
}
