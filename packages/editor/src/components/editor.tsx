import { Ref } from 'solid-js'

import styles from './editor.module.css'

type Props = {
  ref: Ref<HTMLDivElement>
}

export function Editor(props: Props) {
  return <div class={styles.root} ref={props.ref} />
}
