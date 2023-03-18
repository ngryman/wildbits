import { Extension } from '@tiptap/core'

import { Bold } from './bold'
import { Italic } from './italic'
import { Link } from './link'

/**
 * NOTE: Order matters. Higher priority marks will wrap lower priority mark but
 * the opposite is not true.
 *
 * For example, `Bold` has a higher priority than `Italic`. So the following is
 * valid:
 * ```
 * <strong>first <em>middle</em> last</strong>
 * ```
 *
 * However, the opposite is not and will render as follows:
 * ```
 * <em>first </em><strong><em>middle</em></strong><em> last</em>
 * ```
 */
export const Marks = Extension.create({
  name: 'marks',

  addExtensions() {
    return [Bold, Italic, Link]
  },
})
