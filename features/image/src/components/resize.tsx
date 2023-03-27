import { createMemo, onMount } from 'solid-js'
import { createStore, produce } from 'solid-js/store'

import styles from './resize.module.css'

type Props = {
  target: HTMLElement
  minWidth?: number
  maxWidth?: number
  onResize?(width: number): void
  onResizeEnd?(width: number): void
}

type State = {
  startWidth: number
  startHeight: number
  startX: number
  startY: number
  x: number
  y: number
  handle: ResizeHandle
}

export type ResizeHandle = 'north' | 'south' | 'east' | 'west'

const initialState: State = {
  startWidth: 1,
  startHeight: 1,
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  handle: 'north',
}

export function Resize(props: Props) {
  const [state, setState] = createStore<State>(initialState)

  const width = createMemo(() => {
    const deltaX = (state.x - state.startX) * (state.handle.includes('west') ? -1 : +1)
    const deltaY = (state.y - state.startY) * (state.handle.includes('north') ? -1 : +1)

    let width = state.startWidth
    if (state.handle === 'north' || state.handle === 'south') {
      width += deltaY
    } else if (state.handle === 'east' || state.handle == 'west') {
      width += deltaX
    }

    if (props.minWidth && width <= props.minWidth) {
      width = props.minWidth
    } else if (props.maxWidth && width >= props.maxWidth) {
      width = props.maxWidth
    }

    return Math.ceil(width)
  })

  const aspectRatio = () => state.startHeight / state.startWidth
  const height = () => Math.ceil(width() * aspectRatio())

  const startResize = (handle: ResizeHandle, e: PointerEvent) => {
    const { width, height } = props.target.getBoundingClientRect()
    setState({
      startWidth: width,
      startHeight: height,
      startX: e.x,
      startY: e.y,
      x: e.x,
      y: e.y,
      handle,
    })

    document.addEventListener('pointermove', resize)
    document.addEventListener('pointerup', finishResize)
  }

  const resize = (e: PointerEvent) => {
    setState(
      produce(state => {
        state.x = e.x
        state.y = e.y
      })
    )

    props.onResize?.(width())
  }

  const finishResize = (e: PointerEvent) => {
    document.removeEventListener('pointermove', resize)
    document.removeEventListener('pointerup', finishResize)

    setState(
      produce(state => {
        state.x = e.x
        state.y = e.y
      })
    )

    // NOTE: This can
    props.onResizeEnd?.(width())
  }

  onMount(() => {
    setState(
      produce(state => {
        const { width, height } = props.target.getBoundingClientRect()
        state.startWidth = width
        state.startHeight = height
      })
    )
  })

  return (
    <div class={styles.resize}>
      <div
        classList={{ [styles.handle]: true, [styles.north]: true }}
        onPointerDown={[startResize, 'north']}
      />
      <div
        classList={{ [styles.handle]: true, [styles.east]: true }}
        onPointerDown={[startResize, 'east']}
      />
      <div
        classList={{ [styles.handle]: true, [styles.south]: true }}
        onPointerDown={[startResize, 'south']}
      />
      <div
        classList={{ [styles.handle]: true, [styles.west]: true }}
        onPointerDown={[startResize, 'west']}
      />
      <div class={styles.horizontalRuler} data-value={width()} />
      <div class={styles.verticalRuler} data-value={height()} />
    </div>
  )
}
