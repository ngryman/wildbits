import { Editor, createEditor } from '@mindraft/editor'
import { createAtom } from '@mindraft/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { Show } from 'solid-js'

import { Pane, Workspace } from './layout'

export function App() {
  let ref!: HTMLDivElement
  const editor = createEditor(() => ({
    element: ref!,
  }))
  const isSplit = createAtom(false)

  createShortcut(['Control', 'E'], () => {
    isSplit(prev => !prev)
  })

  return (
    <Workspace isSplit={isSplit()}>
      <Pane>
        <Editor ref={ref} />
      </Pane>
      <Presence exitBeforeEnter>
        <Show when={isSplit()}>
          <Pane>
            <div style={{ width: '100%', height: '100%' }} />
          </Pane>
        </Show>
      </Presence>
    </Workspace>
  )
}
