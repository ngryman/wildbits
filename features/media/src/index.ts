import { Extension } from '@tiptap/core'
import { Image } from './extensions'

export const Media = Extension.create({
  name: 'media',

  addExtensions() {
    return [Image]
  },
})
