import { createMemo, onMount, ParentProps } from 'solid-js'

import styles from './bubble-menu.module.css'

type Props = ParentProps & {
  bounds?: DOMRect
}

export function BubbleMenu(props: Props) {
  let ref!: HTMLDivElement
  let refBounds!: DOMRect

  const style = createMemo(() => {
    if (!props.bounds || !refBounds) return undefined

    const left = props.bounds.left + (props.bounds.width - refBounds.width) / 2

    return {
      top: `calc(${props.bounds.top}px - 1rem)`,
      left: `${left}px`,
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
