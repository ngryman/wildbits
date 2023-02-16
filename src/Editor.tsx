import { baseKeymap } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { Node } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { createSignal, onMount } from 'solid-js'
import { css } from 'solid-styled-components'

import { schema } from './schema'

const styles = {
  root: css`
    box-sizing: content-box;
    margin: 0 auto;
    max-width: 60ch;
  `,
}

const initialDoc: Node = schema.node('doc', null, [
  schema.node('heading', null, schema.text(`The Escape Plan`)),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `Welcome to the journey that will help you escape the monotony that is your current life. It will be hard, painful, and non-rewarding. But eventually, with enough perseverance and sweat, you will finally succeed.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `This book is the opposite of the current ambient bullshit that you can read out there, meant to suck all your money and energy for people that don't care about your success. I will focus on action items, retrospectives, experiments, failures, psychology, and all the stuff that will make you a better person overall.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `If you apply everything in this book, you will not be guaranteed success, but you will definitively have a meaning in your life.`
    )
  ),
  schema.node(
    'paragraph',
    null,
    schema.text(
      `The first thing to tackle before anything else, is to know you meat.`
    )
  ),
])

const initialState = EditorState.create({ schema, doc: initialDoc })

export function Editor() {
  const [state, setState] = createSignal(initialState)
  let ref!: HTMLElement

  onMount(() => {
    const view = new EditorView(ref, {
      state: state(),
      plugins: [keymap(baseKeymap)],
      dispatchTransaction(tr) {
        setState(state => {
          state = state.apply(tr)
          view.updateState(state)
          return state
        })
      },
    })
  })

  return <main ref={ref} class={styles.root} />
}
