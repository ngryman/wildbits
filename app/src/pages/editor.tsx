import { Editor, createEditor } from '@wildbits/editor'
import { createAtom } from '@wildbits/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { useParams } from '@solidjs/router'
import { Show } from 'solid-js'

import { Pane, Workspace } from '../layout'

export default function EditorPage() {
  let ref!: HTMLDivElement
  const params = useParams()
  const _editor = createEditor(() => ({
    docId: params.id,
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
