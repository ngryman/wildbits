import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { onMount } from 'solid-js'
import { css } from 'solid-styled-components'

import atom from 'utils'

import { doc } from './doc'
import { schema } from './schema'
import { keymaps, rules } from './plugins'

const styles = {
  root: css`
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

const initialState = EditorState.create({
  schema,
  doc,
  plugins: [rules(schema), keymaps(schema)],
})

export function Editor() {
  const state = atom(initialState)
  let ref!: HTMLDivElement

  onMount(() => {
    const view = new EditorView(ref, {
      state: state(),
      attributes: {
        class: styles.editor,
      },
      dispatchTransaction(tr) {
        state(state => {
          state = state.apply(tr)
          view.updateState(state)
          return state
        })
      },
    })
  })

  return <div ref={ref} class={styles.root} />
}
