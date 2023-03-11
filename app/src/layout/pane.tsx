import { Motion } from '@motionone/solid'
import { ParentProps } from 'solid-js'

import styles from './pane.module.css'

export function Pane(props: ParentProps) {
  return (
    <Motion.div
      class={styles.root}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </Motion.div>
  )
}
