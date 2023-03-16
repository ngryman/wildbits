import { Extension } from '@tiptap/core'
import { Collaboration as CollaborationExtension } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import { createComponent, createRoot } from 'solid-js'

import { Cursor } from './components'
import { Provider } from './primitives'

export interface CollaborationOptions {
  provider: Provider
}

export const Collaboration = Extension.create<CollaborationOptions>({
  name: 'collaboration',

  addExtensions() {
    const { provider } = this.options
    return [
      CollaborationExtension.extend({ name: 'collaboration-internal' }).configure({
        document: provider.doc,
      }),
      CollaborationCursor.configure({
        provider,
        render: user => {
          return createRoot(() => {
            const el = createComponent(Cursor, {
              name: user.name,
              color: user.color,
            })
            // NOTE: In production, it returns a `JSX.FunctionElement`.
            // In development, it returns a `JSX.Element`. I'm not exactly sure
            // why but we need to treat `el` as a thunk to avoid any exception.
            return (typeof el === 'function' ? el() : el) as HTMLElement
          })
        },
      }),
    ]
  },

  addStorage() {
    return {
      provider: null,
    }
  },

  onBeforeCreate() {
    this.storage.provider = this.options.provider
  },
})
