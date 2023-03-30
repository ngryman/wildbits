import { Extension } from '@tiptap/core'
import { Underline } from '@tiptap/extension-underline'

import { Bold } from './bold'
import { BulletList } from './bullet-list'
import { Heading } from './heading'
import { HorizontalRule } from './horizontal-rule'
import { Italic } from './italic'
import { Link } from './link'
import { Trailing } from './trailing'

export const Prose = Extension.create({
  name: 'prose',

  addExtensions() {
    return [
      Bold,
      BulletList,
      Heading,
      HorizontalRule,
      Italic,
      Link,
      Underline,
      Trailing.configure({ afterNodes: ['codeBlock', 'columns', 'image', 'table', 'youtube'] }),
    ]
  },
})
