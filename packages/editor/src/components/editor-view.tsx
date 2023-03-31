import { Editor } from '@tiptap/core'
import { Accessor, createEffect } from 'solid-js'

import styles from './editor-view.module.css'

export type EditorViewProps = {
  editor: Accessor<Editor>
}

export function EditorView(props: EditorViewProps) {
  let ref!: HTMLDivElement

  /**
   * @see https://github.com/ueberdosis/tiptap/blob/3937c44c43877d14be16a8a36fbb107e48d60fcd/packages/react/src/EditorContent.tsx#L48-L70
   */
  function setup(editor: Editor) {
    // Move editor DOM to our reference element
    ref.append(...editor.options.element.childNodes)
    // Point the editor element to our reference element
    editor.setOptions({ element: ref })
    // // Attach the owner to the reactive property of the editor
    // attachSolidOwner(editor)
    // TODO: see what it exactly does
    editor.createNodeViews()
  }

  /**
   * @see https://github.com/ueberdosis/tiptap/blob/3937c44c43877d14be16a8a36fbb107e48d60fcd/packages/react/src/EditorContent.tsx#L109-L137
   */
  function cleanup(editor: Editor) {
    if (!editor.isDestroyed) {
      editor.view.setProps({ nodeViews: {} })
    }
    // TODO: see if that's really necessary
    if (!editor.options.element.firstChild) return
    const newElement = document.createElement('div')
    newElement.append(...editor.options.element.childNodes)
    editor.setOptions({ element: newElement })
  }

  createEffect<Editor>(prevEditor => {
    if (prevEditor) {
      cleanup(prevEditor)
    }

    const editor = props.editor()
    setup(editor)

    return editor
  })

  return <article class={styles.root} ref={ref} />
}
