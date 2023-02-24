import { createEditorState, Document, Editor } from '@mindraft/editor'
import { markdownExtension } from '@mindraft/editor-extension-markdown'
import { createAtom } from '@mindraft/utils'
import { Show } from 'solid-js'
import { createShortcut } from '@solid-primitives/keyboard'
import { Presence } from '@motionone/solid'

import { Pane, Workspace } from './layout'

const initialDoc: Document = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'The Escape Plan' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Welcome to the journey that will help you escape the monotony that is your current life. It will be hard, painful, and non-rewarding. But eventually, with enough perseverance and sweat, you will finally succeed.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "This book is the opposite of the current ambient bullshit that you can read out there, meant to suck all your money and energy for people that don't care about your success. I will focus on action items, retrospectives, experiments, failures, psychology, and all the stuff that will make you a better person overall.",
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'If you apply everything in this book, you will not be guaranteed success, but you will definitively have a meaning in your life.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The first thing to tackle before anything else, is to know you meat.',
        },
      ],
    },
  ],
}

export function App() {
  const state = createEditorState(initialDoc, [markdownExtension()], [])
  const isSplit = createAtom(false)

  createShortcut(['Control', 'E'], () => {
    isSplit(prev => !prev)
  })

  return (
    <Workspace isSplit={isSplit()}>
      <Pane>
        <Editor initialState={state} />
      </Pane>
      <Presence exitBeforeEnter>
        <Show when={isSplit()}>
          <Pane>
            <div style={{ width: '100%', height: '100%' }} />
          </Pane>
        </Show>
      </Presence>
    </Workspace>
  )
}
