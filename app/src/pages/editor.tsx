import { Editor, createEditor } from '@wildbits/editor'
import { createAtom } from '@wildbits/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { useParams } from '@solidjs/router'
import { createEffect, createRenderEffect, Show } from 'solid-js'

import { Pane, Workspace } from '../layout'
import { useUser } from '../signals'

export default function EditorPage() {
  let ref!: HTMLDivElement
  const user = useUser()
  const params = useParams()
  const isSplit = createAtom(false)

  const editor = createEditor(() => ({
    docId: params.id,
    element: ref!,
  }))

  createRenderEffect(() => user())

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor().chain().focus().updateUser(user()!).run()
  })

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
