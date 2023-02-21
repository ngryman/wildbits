import { ParentProps } from 'solid-js'
import { Motion } from '@motionone/solid'
import { css } from 'solid-styled-components'

const DEFAULT_COLOR = '#f4f0e8'

export type PaneProps = ParentProps & {
  color?: string
}

export function Pane(props: PaneProps) {
  const className = css`
    background: ${props.color || DEFAULT_COLOR};
  `

  return (
    <Motion.div
      class={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </Motion.div>
  )
}
