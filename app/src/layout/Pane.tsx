import { createMemo, ParentProps } from 'solid-js'
import { Motion } from '@motionone/solid'
import { css } from 'solid-styled-components'

export type PaneProps = ParentProps & {
  color?: string
}

export function Pane(props: PaneProps) {
  const className = createMemo(() =>
    props.color
      ? css`
          background: ${props.color};
        `
      : undefined
  )

  return (
    <Motion.div
      class={className()}
      style={{ background: props.color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </Motion.div>
  )
}
