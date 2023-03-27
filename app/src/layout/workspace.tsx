import { Note } from '@wildbits/note'
import { ParentProps } from 'solid-js'

import { Menu } from '../components'

import styles from './workspace.module.css'

type Props = ParentProps & {
  notes: Note[]
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
}

export function Workspace(props: Props) {
  return (
    <main class={styles.root}>
      <Menu
        notes={props.notes}
        onCreateNote={props.onCreateNote}
        onDeleteNote={props.onDeleteNote}
      />
      {props.children}
    </main>
  )
}
