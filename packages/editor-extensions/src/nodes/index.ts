import { Extension } from '@tiptap/core'

import { HorizontalRule } from './horizontal-rule'

export const Nodes = Extension.create({
  name: 'nodes',

  addExtensions() {
    return [HorizontalRule]
  },
})
