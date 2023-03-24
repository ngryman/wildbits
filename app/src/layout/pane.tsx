import { ParentProps } from 'solid-js'

import styles from './pane.module.css'

type Props = ParentProps & {
  pushed: boolean
}

export function Pane(props: Props) {
  return (
    <div
      class={styles.root}
      classList={{
        [styles.pushed]: props.pushed,
      }}
    >
      {props.children}
    </div>
  )
}
