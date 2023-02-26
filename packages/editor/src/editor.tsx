import { EditorState } from '@mindraft/create-editor'
import { EditorTheme } from '@mindraft/editor-theme'
import { createAtom } from '@mindraft/utils'
import { EditorView } from 'prosemirror-view'
import { onMount, Show } from 'solid-js'
import { css } from 'solid-styled-components'

import { EditorContainer } from './editor-container'

export type EditorProps = {
  initialState: EditorState
  theme: EditorTheme
}

const styles = {
  editor: css`
    word-wrap: break-word;
    white-space: break-spaces;
  `,
}

export function Editor(props: EditorProps) {
  const debug = createAtom(false)
  const state = createAtom(props.state)
  let ref!: HTMLDivElement

  onMount(() => {
    const view: EditorView = new EditorView(ref, {
      state: props.initialState,
      attributes: {
        class: styles.editor,
      },
      handleTripleClick() {
        debug(!debug())
      },
      dispatchTransaction(tr) {
        const editorState = view.state.apply(tr)
        view.updateState(editorState)
        state(editorState)
        return editorState
      },
    })
  })

  return (
    <>
      <EditorContainer ref={ref} />
      <Show when={debug()}>
        <textarea rows={20} cols={100}>
          {JSON.stringify(state().doc, null, 2)}
        </textarea>
      </Show>
    </>
  )
}
