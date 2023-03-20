import { BubbleMenu, Button, Icons } from '@wildbits/ui'
import { NodeViewProps } from '@wildbits/utils'
import { createEffect, Show } from 'solid-js'

import { ImageAlign, ImageAttributes } from '../extensions'

import styles from './image.module.css'

export function ImageView(props: NodeViewProps<ImageAttributes>) {
  const attributes = () => props.attributes
  const selected = () => props.selected

  function setAlign(align: ImageAlign) {
    console.log('setAlign')
    props.setAttributes({ align })
  }

  const setAlignLeft = () => setAlign('left')
  const setAlignCenter = () => setAlign('center')
  const setAlignRight = () => setAlign('right')

  createEffect(() => {
    console.log(attributes().align)
  })

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
          <Button active={attributes().align === 'left'} onClick={setAlignLeft}>
            <Icons.ImageAlignLeft />
          </Button>
          <Button active={attributes().align === 'center'} onClick={setAlignCenter}>
            <Icons.ImageAlignCenter />
          </Button>
          <Button active={attributes().align === 'right'} onClick={setAlignRight}>
            <Icons.ImageAlignRight />
          </Button>
        </BubbleMenu>
      </Show>
    </figure>
  )
}
