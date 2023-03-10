import { ParentProps } from 'solid-js'

import styles from './workspace.module.css'

type Props = ParentProps & {
  split: boolean
}

export function Workspace(props: Props) {
  return (
    <main classList={{ [styles.root]: true, [styles.split]: props.split }}>
      {props.children}
    </main>
  )
}
