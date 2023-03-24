import { ParentProps } from 'solid-js'

import styles from './workspace.module.css'

export function Workspace(props: ParentProps) {
  return <main class={styles.root}>{props.children}</main>
}
