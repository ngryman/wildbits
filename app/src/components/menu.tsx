import { A } from '@solidjs/router'
import { Button, Icons } from '@wildbits/ui'
import { createAtom } from '@wildbits/utils'
import { Note } from '@wildbits/note'
import { For, Show } from 'solid-js'

import styles from './menu.module.css'

type Props = {
  notes: Note[]
  onDeleteNote: (note: Note) => void
}

export function Menu(props: Props) {
  const overIndex = createAtom(-1)

  function handleOver(index: number) {
    overIndex(index)
  }

  function handleLeave() {
    overIndex(-1)
  }

  function handleDeleteClick() {
    const note = props.notes[overIndex()]
    props.onDeleteNote(note)
  }

  return (
    <nav class={styles.root} onPointerLeave={handleLeave}>
      <For each={props.notes}>
        {(note, i) => (
          <A
            class={styles.link}
            activeClass={styles.active}
            href={note.path}
            onPointerOver={[handleOver, i()]}
          >
            {note.title}
          </A>
        )}
      </For>
      <Show when={overIndex() !== -1}>
        <div class={styles.actions} style={{ ['--index']: overIndex() }}>
          <Button size="normal" onClick={handleDeleteClick}>
            <Icons.Delete />
          </Button>
        </div>
      </Show>
    </nav>
  )
}
