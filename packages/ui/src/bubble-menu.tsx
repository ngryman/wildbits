import { ParentProps } from 'solid-js'

import styles from './bubble-menu.module.css'

export function BubbleMenu(props: ParentProps) {
  return <div class={styles.root}>{props.children}</div>
}
