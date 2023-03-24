import { BubbleMenu, Button, Divider, Icons } from '@wildbits/ui'
import { NodeViewProps } from '@wildbits/utils'
import { Show } from 'solid-js'

import { ImageAlign, ImageAttributes } from '..'

import styles from './image.module.css'

export function ImageView(props: NodeViewProps<ImageAttributes>) {
  const attributes = () => props.attributes
  const selected = () => props.selected

  function setAlign(align: ImageAlign) {
    props.setAttributes({ align })
  }

  const setAlignLeft = () => setAlign('left')
  const setAlignCenter = () => setAlign('center')
  const setAlignRight = () => setAlign('right')

  const deleteNode = () => props.deleteNode()

  return (
    <figure
      class={styles.figure}
      classList={{
        [styles.selected]: selected(),
        [styles['align-' + (attributes().align || 'center')]]: true,
      }}
    >
      {props.children}
      <Show when={attributes().title || attributes().alt}>
        <figcaption class={styles.caption}>{attributes().title || attributes().alt}</figcaption>
      </Show>
      <Show when={selected()}>
        <BubbleMenu>
          <Button size="small" active={attributes().align === 'left'} onClick={setAlignLeft}>
            <Icons.ImageAlignLeft />
          </Button>
          <Button size="small" active={attributes().align === 'center'} onClick={setAlignCenter}>
            <Icons.ImageAlignCenter />
          </Button>
          <Button size="small" active={attributes().align === 'right'} onClick={setAlignRight}>
            <Icons.ImageAlignRight />
          </Button>
          <Divider />
          <Button size="small" onClick={deleteNode}>
            <Icons.Delete />
          </Button>
        </BubbleMenu>
      </Show>
    </figure>
  )
}
