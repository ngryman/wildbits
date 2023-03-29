import { Command } from '@tiptap/core'

import { KatexAttributes } from '..'

export function setKatex(attrs: KatexAttributes): Command {
  return ({ chain, editor }) =>
    chain().insertContent({ type: editor.schema.nodes.katex.name, attrs }).scrollIntoView().run()
}
