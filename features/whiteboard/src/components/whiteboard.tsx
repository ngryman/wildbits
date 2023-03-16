import { getAwareness, getDoc } from '@wildbits/collaboration'
import { IdAttributes, NodeViewProps, Passthrough } from '@wildbits/utils'
import { For } from 'solid-js'

import { usePaths, useStrokes } from '../hooks'
import { Point } from '../types'

// import styles from './whiteboard.module.css'

export function Whiteboard(props: NodeViewProps<IdAttributes>) {
  const svg = props.children as SVGSVGElement
  const awareness = getAwareness(props.editor)
  const doc = getDoc(props.editor)
  const [strokes, { startStroke, addPointToStroke, finishStroke }] = useStrokes(doc, props.attrs.id)
  const paths = usePaths(strokes)

  let drawing = false
  let nextPoint: Point
  let nextTick = 0

  function handleStart() {
    drawing = true
    startStroke()
    svg.addEventListener('pointermove', handleMove)
  }

  function handleMove(e: PointerEvent) {
    e.preventDefault()

    nextPoint = [e.offsetX, e.offsetY, 1]
    if (!nextTick) {
      nextTick = requestAnimationFrame(() => {
        addPointToStroke(nextPoint)
        nextTick = 0
      })
    }
  }

  function handleEnd() {
    if (!drawing) return

    drawing = false
    finishStroke()

    svg.removeEventListener('pointermove', handleMove)
  }

  function handleEnter() {
    svg.addEventListener('pointermove', handleUpdateCoords)
  }

  function handleUpdateCoords(e: PointerEvent) {
    awareness.setLocalStateField('coords', { x: e.offsetX, y: e.offsetY })
  }

  function handleLeave() {
    awareness.setLocalStateField('coords', null)
    handleEnd()

    svg.removeEventListener('pointermove', handleUpdateCoords)
  }

  return (
    <Passthrough
      element={svg}
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      <For each={paths()}>{path => <path d={path} />}</For>
    </Passthrough>
  )
}
