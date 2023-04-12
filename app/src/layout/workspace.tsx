import { useState } from '@wildbits/model'
import { Button, Icons } from '@wildbits/ui'
import { ParentProps } from 'solid-js'

import { Menu } from '../components'

import styles from './workspace.module.css'

type Props = ParentProps & {
  onToggleMenu: () => void
}

export function Workspace(props: Props) {
  const [state] = useState()

  return (
    <main class={styles.root} classList={{ [styles.menuVisible]: state.menuVisible }}>
      <Button
        class={styles.toggle}
        size="large"
        active={state.menuVisible}
        onClick={props.onToggleMenu}
      >
        <Icons.Menu />
      </Button>
      <Menu />
      {props.children}
    </main>
  )
}
