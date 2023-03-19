import { Extension } from '@tiptap/core'
import { Image } from './extensions'

export const Media = Extension.create({
  addExtensions() {
    return [Image.configure({ allowBase64: true })]
  },
})
