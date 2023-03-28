import { createMemo, onMount, ParentProps } from 'solid-js'
import { remToPx } from '@wildbits/utils'

import styles from './bubble-menu.module.css'

type Props = ParentProps & {
  bounds?: DOMRect
}

const PADDING = remToPx(1)

export function BubbleMenu(props: Props) {
  let ref!: HTMLDivElement
  let refBounds!: DOMRect

  const style = createMemo(() => {
    const { bounds } = props

    // By default the menu will be displayed above the first ancestor with a
    // `position: relative`.
    if (!bounds || !refBounds) return undefined

    let top = bounds.top - refBounds.height - PADDING
    if (top < 0) {
      top = bounds.top + bounds.height + PADDING
    }

    const left = bounds.left + (bounds.width - refBounds.width) / 2

    return {
      top: `${top}px`,
      left: `${left}px`,
      // Override default
      translate: '0 0',
    }
  })

  onMount(() => {
    refBounds = ref.getBoundingClientRect()
  })

  return (
    <div ref={ref} class={styles.root} style={style()}>
      {props.children}
    </div>
  )
}
