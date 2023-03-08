import {
  Peers,
  createPeers,
  createProvider,
  createUser,
} from '@wildbits/collaboration'
import { Editor, createEditor } from '@wildbits/editor'
import { createAtom } from '@wildbits/utils'
import { Presence } from '@motionone/solid'
import { createShortcut } from '@solid-primitives/keyboard'
import { useParams } from '@solidjs/router'
import { createEffect, createRenderEffect, Show } from 'solid-js'

import { Pane, Workspace } from '../layout'

export default function EditorPage() {
  let ref!: HTMLDivElement
  const split = createAtom(false)
  const params = useParams()

  const provider = createProvider({ id: params.id })
  const user = createUser()
  const peers = createPeers(provider)
  const editor = createEditor(() => ({ element: ref!, provider }))

  createRenderEffect(() => user())

  createEffect(() => {
    localStorage.setItem('user', JSON.stringify(user()))
    editor().chain().focus().updateUser(user()).run()
  })

  createShortcut(['Control', 'E'], () => {
    split(prev => !prev)
  })

  return (
    <Workspace isSplit={split()}>
      <Pane>
        <Editor ref={ref} />
        <Peers peers={peers()} />
      </Pane>
      <Presence exitBeforeEnter>
        <Show when={split()}>
          <Pane>
            <div style={{ width: '100%', height: '100%' }} />
          </Pane>
        </Show>
      </Presence>
    </Workspace>
  )
}
