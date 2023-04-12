import { createLocator, createNote, getLocatorPath, useNotes, useState } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { clickOutside } from '@wildbits/utils'

import { Nav } from './nav'

import styles from './menu.module.css'
import { useNavigate } from '@solidjs/router'

// Make sure the directive is included in the final bundle.
// https://www.solidjs.com/guides/typescript#use___
false && clickOutside

export function Menu() {
  const navigate = useNavigate()
  const notes = useNotes()
  const [state, setState] = useState()

  const hideOnMobile = () => {
    if (matchMedia('(max-width: 1200px)').matches) {
      setState('menuVisible', false)
    }
  }

  const handleCreateNote = () => {
    const locator = createLocator()
    const note = createNote(locator)
    notes.set(locator.id, note)
    navigate(getLocatorPath(locator))
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
      <Nav />
      <Button class={styles.add} onClick={handleCreateNote}>
        <Icons.Plus />
      </Button>
    </div>
  )
}
