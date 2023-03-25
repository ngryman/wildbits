import { BubbleMenu, Button, Divider, Icons } from '@wildbits/ui'
import { NodeViewProps, remToPx } from '@wildbits/utils'
import { createEffect, createSignal, Show } from 'solid-js'

import { ImageAlign, ImageAttributes } from '..'
import { Resize } from './resize'

import styles from './image.module.css'

// TODO: sync with CSS
const MIN_WITH_REM = 10

export function ImageView(props: NodeViewProps<ImageAttributes>) {
  let figureEl!: HTMLImageElement
  let imageEl!: HTMLImageElement
  const minWidth = remToPx(MIN_WITH_REM)

  const attrs = () => props.attrs
  const selected = () => props.selected
  const [width, setWidth] = createSignal<number | string>('auto')

  const setAlign = (align: ImageAlign) => props.setAttributes({ align })
  const setAlignLeft = () => setAlign('left')
  const setAlignCenter = () => setAlign('center')
  const setAlignRight = () => setAlign('right')
  const deleteNode = () => props.deleteNode()
  const resize = (width: number) => setWidth(width)
  const finishResize = (width: number) => props.setAttributes({ width })

  createEffect(() => {
    if (attrs().width) {
      setWidth(attrs().width!)
    }
  })

  return (
    <figure
      ref={figureEl}
      class={styles.figure}
      classList={{
        [styles.selected]: selected(),
        [styles['align-' + (attrs().align || 'center')]]: true,
      }}
    >
      <img
        ref={imageEl}
        class={styles.image}
        src={attrs().src}
        alt={attrs().alt}
        width={width()}
        data-drag-handle
      />
      <Show when={attrs().title || attrs().alt}>
        <figcaption class={styles.caption}>{attrs().title || attrs().alt}</figcaption>
      </Show>
      <Show when={selected()}>
        <Resize target={imageEl} minWidth={minWidth} onResize={resize} onResizeEnd={finishResize} />
        <BubbleMenu>
          <Button size="small" active={attrs().align === 'left'} onClick={setAlignLeft}>
            <Icons.ImageAlignLeft />
          </Button>
          <Button size="small" active={attrs().align === 'center'} onClick={setAlignCenter}>
            <Icons.ImageAlignCenter />
          </Button>
          <Button size="small" active={attrs().align === 'right'} onClick={setAlignRight}>
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
