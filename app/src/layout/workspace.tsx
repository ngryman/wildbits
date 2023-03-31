import { Note } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { ParentProps } from 'solid-js'

import { Menu } from '../components'

import styles from './workspace.module.css'

type Props = ParentProps & {
  notes: Note[]
  menuVisible?: boolean
  onToggleMenu: () => void
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
}

export function Workspace(props: Props) {
  return (
    <main class={styles.root} classList={{ [styles.menuVisible]: props.menuVisible }}>
      <Button class={styles.toggle} size="large" onClick={props.onToggleMenu}>
        <Icons.Menu />
      </Button>
      <Menu
        notes={props.notes}
        visible={props.menuVisible}
        onCreateNote={props.onCreateNote}
        onDeleteNote={props.onDeleteNote}
      />
      {props.children}
    </main>
  )
}
