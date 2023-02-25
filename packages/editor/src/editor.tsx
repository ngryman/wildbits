import { EditorState } from '@mindraft/create-editor'
import { createAtom } from '@mindraft/utils'
import { EditorView } from 'prosemirror-view'
import { onMount, Show } from 'solid-js'
import { css } from 'solid-styled-components'

import { createStyle } from './create-style'
import { EditorTheme } from './theme'

export type EditorProps = {
  initialState: EditorState
  theme: EditorTheme
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
  const debug = createAtom(false)
  const state = createAtom(props.state)
  let ref!: HTMLDivElement

  onMount(() => {
    const view: EditorView = new EditorView(ref, {
      state: props.initialState,
      attributes: {
        class: createStyle(props.theme),
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
      <div ref={ref} class={styles.root} />
      <Show when={debug()}>
        <textarea rows={20} cols={100}>
          {JSON.stringify(state().doc, null, 2)}
        </textarea>
      </Show>
    </>
  )
}
