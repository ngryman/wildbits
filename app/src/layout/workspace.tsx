import { Note } from '@wildbits/note'
import { ParentProps } from 'solid-js'

import { Menu } from '../components'

import styles from './workspace.module.css'

type Props = ParentProps & {
  notes: Note[]
  onDeleteNote: (noteId: string) => void
}

export function Workspace(props: Props) {
  return (
    <main class={styles.root}>
      <Menu notes={props.notes} onDeleteNote={props.onDeleteNote} />
      {props.children}
    </main>
  )
}
