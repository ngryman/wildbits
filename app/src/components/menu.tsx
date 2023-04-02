import { Note, useState } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { clickOutside } from '@wildbits/utils'

import { Nav } from './nav'

import styles from './menu.module.css'

// Make sure the directive is included in the final bundle.
// https://www.solidjs.com/guides/typescript#use___
false && clickOutside

type Props = {
  notes: Note[]
  onCreateNote(): void
  onDeleteNote(id: string): void
}

export function Menu(props: Props) {
  const [state, setState] = useState()

  const hideOnMobile = () => {
    if (matchMedia('(max-width: 1200px)').matches) {
      setState('menuVisible', false)
    }
  }
  return (
    <div
      class={styles.root}
      classList={{ [styles.visible]: state.menuVisible }}
      use:clickOutside={hideOnMobile}
    >
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
