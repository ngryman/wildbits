import { Extension } from '@tiptap/core'
import { Attrs } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { createPluginView, titleCase } from '@wildbits/utils'

import { FloatingMenu as FloatingMenuView } from './components'

export type ActionName = 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'link'

export type ActionField = {
  key: string
  name: string
}

export type Action = {
  name: ActionName
  command: string
  commandIf?: [(attrs: Attrs) => boolean, string]
  extend?: boolean
  fields: ActionField[]
}

export type FloatingMenuOptions = {
  actions: (ActionName | Action)[]
}

export const FloatingMenu = Extension.create<FloatingMenuOptions>({
  name: 'floating-menu',

  addOptions() {
    return {
      actions: [],
    }
  },

  addProseMirrorPlugins() {
    const actions: Action[] = this.options.actions.map(action => {
      if (typeof action === 'string') {
        const titleCasedAction = titleCase(action)
        return {
          name: action,
          command: `toggle${titleCasedAction}`,
          fields: [],
        }
      }
      return action
    })

    return [
      new Plugin({
        key: new PluginKey(this.name),
        view: () => createPluginView(FloatingMenuView, { actions }, this.editor),
      }),
    ]
  },
})
