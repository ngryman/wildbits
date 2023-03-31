import { A } from '@solidjs/router'
import { Note } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { createAtom } from '@wildbits/utils'
import { For, Show } from 'solid-js'

import styles from './nav.module.css'

type Props = {
  notes: Note[]
  onDeleteNote?(id: string): void
}

export function Nav(props: Props) {
  const overIndex = createAtom(-1)

  const resetOverIndex = () => overIndex(-1)

  const deleteNote = () => {
    const note = props.notes[overIndex()]
    props.onDeleteNote?.(note.id)
  }

  return (
    <nav class={styles.root} onPointerLeave={resetOverIndex}>
      <For each={props.notes}>
        {(note, i) => (
          <A
            class={styles.link}
            activeClass={styles.active}
            href={note.path}
            onPointerOver={[overIndex, i()]}
          >
            {note.title || 'New note'}
          </A>
        )}
      </For>
      <Show when={overIndex() !== -1}>
        <div class={styles.actions} style={{ ['--index']: overIndex() }}>
          <Button size="normal" onClick={deleteNote}>
            <Icons.Delete />
          </Button>
        </div>
      </Show>
    </nav>
  )
}
