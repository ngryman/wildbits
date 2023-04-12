import { A, useNavigate } from '@solidjs/router'
import { useNotes } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { createAtom } from '@wildbits/utils'
import { For, Show, createMemo } from 'solid-js'

import styles from './nav.module.css'

export function Nav() {
  const notes = useNotes()
  const navigate = useNavigate()
  const hoverIndex = createAtom(-1)
  const notesList = createMemo(() => Array.from(notes.values()))

  const resetHoverIndex = () => hoverIndex(-1)

  const handleDeleteNote = () => {
    const note = notesList()[hoverIndex()]
    notes.delete(note.id)

    if (notesList().length > 0) {
      navigate(notesList()[notesList().length - 1].path || '/')
    } else {
      navigate('/')
    }
  }

  return (
    <nav class={styles.root} onPointerLeave={resetHoverIndex}>
      <For each={notesList()}>
        {(note, i) => (
          <A
            class={styles.link}
            activeClass={styles.active}
            href={note.path}
            onPointerOver={[hoverIndex, i()]}
          >
            {note.title || 'New note'}
          </A>
        )}
      </For>
      <Show when={hoverIndex() !== -1}>
        <div class={styles.actions} style={{ ['--index']: hoverIndex() }}>
          <Button class={styles.delete} size="normal" onClick={handleDeleteNote}>
            <Icons.Delete />
          </Button>
        </div>
      </Show>
    </nav>
  )
}
