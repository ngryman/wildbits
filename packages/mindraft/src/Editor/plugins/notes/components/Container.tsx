import { Presence } from '@motionone/solid'
import { Show } from 'solid-js'
import { css } from 'solid-styled-components'
import { Node } from 'prosemirror-model'

import clickOutside from 'directives/click-outside'
import { useNotes } from 'contexts/notes'

import { useState } from '../state'
import { Note } from './Note'

const styles = {
  root: css`
    position: absolute;
    width: 100%;
  `,
}

export function Container() {
  const state = useState()
  const notes = useNotes()

  const doc = () => {
    const s = state.get()
    return s.mode === 'update' ? notes.get(s.index).doc : undefined
  }

  const top = () => {
    const s = state.get()
    return s.mode !== 'hidden' ? s.top : 0
  }

  function handleChange(doc: Node) {
    const s = state.get()

    if (s.mode === 'create') {
      notes.create({
        from: s.from,
        to: s.to,
        doc,
      })
      state.update(notes.length - 1)
    } else if (s.mode === 'update') {
      notes.updateNoteDoc(s.index, doc)
    }
  }

  return (
    <div class={styles.root} use:clickOutside={() => state.reset()}>
      <Presence exitBeforeEnter>
        <Show when={state.get().mode !== 'hidden'}>
          <Note doc={doc()} top={top()} onChange={handleChange} />
        </Show>
      </Presence>
    </div>
  ) as HTMLElement
}
