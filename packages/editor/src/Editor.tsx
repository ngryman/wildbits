import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { onMount } from 'solid-js'
import { css } from 'solid-styled-components'

import { doc } from './doc'
import { schema } from './schema'
// import { keymaps, note, rules } from '../../../plugins'

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

export function Editor() {
  let ref!: HTMLDivElement

  onMount(() => {
    // TODO: perhaps we should wrap this into an Atom so we can react to the editor changes outside.
    const state = EditorState.create({
      schema,
      doc,
      // plugins: [keymaps(schema), note(), rules(schema)],
    })

    const view: EditorView = new EditorView(ref, {
      state,
      attributes: {
        class: styles.editor,
      },
      dispatchTransaction(tr) {
        const state = view.state.apply(tr)
        view.updateState(state)
        return state
      },
    })
  })

  return <div ref={ref} class={styles.root} />
}
