import { Extension } from '@tiptap/core'
import { Underline } from '@tiptap/extension-underline'

import { Bold } from './bold'
import { HorizontalRule } from './horizontal-rule'
import { Italic } from './italic'
import { Link } from './link'

export const Prose = Extension.create({
  name: 'prose',

  addExtensions() {
    return [Bold, HorizontalRule, Italic, Link, Underline]
  },
})
