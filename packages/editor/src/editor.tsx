import { Ref } from 'solid-js'

import styles from './editor.module.css'

export type EditorProps = {
  ref: Ref<HTMLDivElement>
}

export function Editor(props: EditorProps) {
  return <div class={styles.root} ref={props.ref} />
}
