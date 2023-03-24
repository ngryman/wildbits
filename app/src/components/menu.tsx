import { Motion } from '@motionone/solid'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

import { Note } from '../signals'

import styles from './menu.module.css'

type Props = {
  notes: Note[]
}

export function Menu(props: Props) {
  return (
    <Motion.nav class={styles.root} exit={{ opacity: 0, x: '-100%' }}>
      <For each={props.notes}>
        {note => (
          <A class={styles.link} href={note.path}>
            {note.title}
          </A>
        )}
      </For>
    </Motion.nav>
  )
}
