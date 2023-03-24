import { ImageAttributes } from '../extension'

export { setImage } from './set-image'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    image: {
      /**
       * Add an image
       */
      setImage: (attrs: ImageAttributes) => ReturnType
    }
  }
}
