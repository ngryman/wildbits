import { A } from '@solidjs/router'
import { For } from 'solid-js'

import { Note } from '../signals'

import styles from './menu.module.css'

type Props = {
  notes: Note[]
}

export function Menu(props: Props) {
  return (
    <nav class={styles.root}>
      <For each={props.notes}>
        {note => (
          <A class={styles.link} activeClass={styles.active} href={note.path}>
            {note.title}
          </A>
        )}
      </For>
    </nav>
  )
}
