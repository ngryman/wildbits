import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { createPluginView } from '@wildbits/utils'

import { FloatingMenu as FloatingMenuView } from './components'

export type Action = 'bold' | 'italic' | 'underline' | 'strike' | 'code'

export type FloatingMenuOptions = {
  actions: Action[]
}

export const FloatingMenu = Extension.create<FloatingMenuOptions>({
  name: 'floating-menu',

  addOptions() {
    return {
      actions: [],
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        view: () => createPluginView(FloatingMenuView, this.options, this.editor),
      }),
    ]
  },
})
