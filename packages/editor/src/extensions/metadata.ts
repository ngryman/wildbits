import { Extension } from '@tiptap/core'

export const Metadata = Extension.create({
  name: 'metadata',

  addStorage() {
    return {
      title: null,
    }
  },

  /**
   * @todo We might want to debounce this, but we might not as well :)
   */
  onUpdate() {
    const node = this.editor.state.doc.firstChild!
    const nodeText = node.content.textBetween(0, node.content.size)

    const title = nodeText && !nodeText.startsWith('#') ? nodeText : null

    if (title !== this.storage.title) {
      this.storage.title = title
    }
  },
})
