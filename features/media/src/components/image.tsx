import { NodeViewProps } from '@wildbits/utils'
import { Show } from 'solid-js'
import { ImageAttributes } from '../extensions'

import styles from './image.module.css'

export function ImageView(props: NodeViewProps<ImageAttributes>) {
  const attributes = () => props.attributes
  const selected = () => props.selected

  return (
    <figure
      class={styles.figure}
      classList={{
        [styles.selected]: selected(),
      }}
    >
      {props.children}
      <Show when={attributes().title || attributes().alt}>
        <figcaption class={styles.caption}>{attributes().title || attributes().alt}</figcaption>
      </Show>
    </figure>
  )
}
