import { Note } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'

import { Nav } from './nav'

import styles from './menu.module.css'

type Props = {
  notes: Note[]
  visible?: boolean
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
}

export function Menu(props: Props) {
  return (
    <div class={styles.root} classList={{ [styles.visible]: props.visible }}>
      <h1 class={styles.logo}>
        <Icons.Logo />
        wildbits
      </h1>
      <Nav notes={props.notes} onDeleteNote={props.onDeleteNote} />
      <Button class={styles.add} onClick={props.onCreateNote}>
        <Icons.Plus />
      </Button>
    </div>
  )
}
