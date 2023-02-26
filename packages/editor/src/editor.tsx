import { Editor as EditorClass } from '@mindraft/create-editor'
import { EditorTheme } from '@mindraft/editor-theme'
import { Document, Node } from '@mindraft/editor-utils'
import { EditorView } from 'prosemirror-view'
import { createEffect, onMount } from 'solid-js'
import { css } from 'solid-styled-components'

import { EditorContainer } from './editor-container'

export type EditorProps = {
  doc: Document
  editor: EditorClass
  theme: EditorTheme
}

const styles = {
  editor: css`
    word-wrap: break-word;
    white-space: break-spaces;
  `,
}

export function Editor(props: EditorProps) {
  let ref!: HTMLDivElement

  onMount(() => {
    const view: EditorView = new EditorView(ref, {
      state: props.editor.state,
      attributes: {
        class: styles.editor,
      },
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr)
        view.updateState(newState)
        return newState
      },
    })

    createEffect(() => {
      const prevDoc = view.state.doc

      if (
        props.doc &&
        (!prevDoc || !prevDoc.eq(props.doc as unknown as Node))
      ) {
        const tr = view.state.tr.replaceWith(
          0,
          view.state.doc.content.size,
          Node.fromJSON(view.state.schema, props.doc)
        )
        view.dispatch(tr)
      }

      return props.doc
    })
  })

  return <EditorContainer ref={ref} />
}
