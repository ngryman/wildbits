import { Motion } from '@motionone/solid'
import { ParentProps } from 'solid-js'

export function Pane(props: ParentProps) {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0 }}
    >
      {props.children}
    </Motion.div>
  )
}
