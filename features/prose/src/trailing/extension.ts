import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface TrailingOptions {
  node: string
  afterNodes: string[]
}

export const Trailing = Extension.create<TrailingOptions>({
  name: 'trailing',

  addOptions() {
    return {
      node: 'paragraph',
      afterNodes: [],
    }
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey(this.name)
    const afterNodes = Object.entries(this.editor.schema.nodes)
      .map(([, value]) => value)
      .filter(node => this.options.afterNodes.includes(node.name))

    return [
      new Plugin({
        key: pluginKey,
        appendTransaction: (_, __, state) => {
          const { doc, tr, schema } = state
          const shouldAppend = pluginKey.getState(state)
          if (!shouldAppend) return

          const endPos = doc.content.size
          const type = schema.nodes[this.options.node]
          return tr.insert(endPos, type.create())
        },
        state: {
          init: (_, state) => {
            const { lastChild } = state.doc
            if (!lastChild) return false
            return afterNodes.includes(lastChild.type)
          },
          apply: (tr, value) => {
            const { lastChild } = tr.doc
            if (!tr.docChanged) return value
            if (!lastChild) return false
            return afterNodes.includes(lastChild.type)
          },
        },
      }),
    ]
  },
})
