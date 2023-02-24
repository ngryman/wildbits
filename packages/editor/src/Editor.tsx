import { createAtom } from '@mindraft/utils'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { onMount } from 'solid-js'
import { css } from 'solid-styled-components'

export type EditorProps = {
  initialState: EditorState
}

const styles = {
  root: css`
    position: relative;
    margin: 0 auto;
    max-width: 60ch;
  `,
  editor: css`
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */
  `,
}

export function Editor(props: EditorProps) {
  const state = createAtom(props.initialState)
  let ref!: HTMLDivElement

  onMount(() => {
    const view: EditorView = new EditorView(ref, {
      state: state(),
      attributes: {
        class: styles.editor,
      },
      dispatchTransaction(tr) {
        const editorState = view.state.apply(tr)
        view.updateState(editorState)
        state(editorState)
        return editorState
      },
    })
  })

  return <div ref={ref} class={styles.root} />
}
