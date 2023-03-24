import { ParentProps } from 'solid-js'

import { Menu } from '../components'
import { Note } from '../signals'

import styles from './workspace.module.css'

type Props = ParentProps & {
  notes: Note[]
}

export function Workspace(props: Props) {
  return (
    <main class={styles.root}>
      <Menu notes={props.notes} />
      {props.children}
    </main>
  )
}
