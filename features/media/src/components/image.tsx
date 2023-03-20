import { ParentProps, Show } from 'solid-js'
import { ImageAttributes } from '../extensions'

type Props = ParentProps & ImageAttributes

export function ImageView(props: Props) {
  return (
    <figure>
      {props.children}
      <Show when={props.title || props.alt}>
        <figcaption>{props.title || props.alt}</figcaption>
      </Show>
    </figure>
  )
}
