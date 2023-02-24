import { Motion } from '@motionone/solid'
import { createEffect, onMount } from 'solid-js'
import { css } from 'solid-styled-components'
import { Node } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'

import { keymaps, placeholder, rules } from 'editor/plugins'
import { schema } from 'editor/schema'

export type NoteProps = {
  doc?: Node
  top: number
  onChange?(doc: Node): void
}

const styles = {
  note: css`
    position: absolute;
    left: calc(100% + 1rem);
    border-radius: 4px;
    box-shadow: 4px 4px 0 0 #c9b08a;
    min-width: 30ch;
    font-size: 0.8rem;
    line-height: 1.4;
    background-color: #efd0a2;
    will-change: contents;
  `,
  editor: css`
    padding: 1rem;
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: 'liga' 0; /* the above doesn't seem to work in Edge */

    & > p:first-of-type {
      margin-top: 0;
    }

    & > p:last-of-type {
      margin-bottom: 0;
    }
  `,
}

export function Note(props: NoteProps) {
  let ref!: HTMLDivElement

  const isNew = () => !props.doc

  onMount(() => {
    const state = EditorState.create({
      schema,
      doc: props.doc,
      plugins: [keymaps(schema), rules(schema), placeholder(`New note...`)],
    })

    const view: EditorView = new EditorView(ref, {
      state,
      attributes: {
        class: styles.editor,
      },
      dispatchTransaction(tr) {
        const state = view.state.apply(tr)
        view.updateState(state)
        if (tr.docChanged) {
          props.onChange?.(state.doc)
        }
        return state
      },
    })

    createEffect(prevDoc => {
      if (props.doc && (!prevDoc || !props.doc.eq(prevDoc as Node))) {
        const tr = view.state.tr.replaceWith(
          0,
          view.state.doc.content.size,
          props.doc
        )
        view.dispatch(tr)
      }

      return props.doc
    }, props.doc)
  })

  // XXX: compensate the h1 margin top, we should remove it
  const bias = 60
  const top = () => props.top - bias + window.scrollY

  return (
    <Motion.div
      class={styles.note}
      // XXX: make sure to set different y, otherwise it will reset to 0. This is a bug of Motion One
      // TODO: File the bug to Motion One
      initial={{ opacity: 0, x: -50, y: top() - 0.01 }}
      animate={{ opacity: isNew() ? 0.5 : 1, x: 0, y: top() }}
      hover={{ opacity: 1 }}
      exit={{ opacity: 0, x: 50 }}
    >
      <div ref={ref} />
    </Motion.div>
  )
}
