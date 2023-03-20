import { Extension } from '@tiptap/core'

import { Bold } from './bold'
import { HorizontalRule } from './horizontal-rule'
import { Italic } from './italic'
import { Link } from './link'

export const Prose = Extension.create({
  name: 'prose',

  addExtensions() {
    return [Bold, HorizontalRule, Italic, Link]
  },
})
