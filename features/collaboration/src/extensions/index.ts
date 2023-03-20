import { Extension } from '@tiptap/core'
import { Collaboration as CollaborationExtension } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { createComponent } from 'solid-js'

import { Cursor, Provider } from '../'

export interface CollaborationOptions {
  provider: Provider
}

export const Collaboration = Extension.create<CollaborationOptions>({
  name: 'collaboration',

  addExtensions() {
    return [
      CollaborationExtension.extend({ name: 'collaboration-internal' }).configure({
        document: this.options.provider.document,
      }),
      CollaborationCursor.configure({
        provider: this.options.provider.webrtcProvider,
        render: user => {
          const el = createComponent(Cursor, {
            name: user.name,
            color: user.color,
          })
          // NOTE: In production, it returns a `JSX.FunctionElement`.
          // In development, it returns a `JSX.Element`. I'm not exactly sure
          // why but we need to treat `el` as a thunk to avoid any exception.
          return (typeof el === 'function' ? el() : el) as HTMLElement
        },
      }),
    ]
  },
})
