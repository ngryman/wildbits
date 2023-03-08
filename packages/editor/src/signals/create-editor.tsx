import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TypographyExt from '@tiptap/extension-typography'
import { Editor } from '@tiptap/core'
import { Accessor, createEffect, createRoot, JSX, onCleanup } from 'solid-js'
import { createTiptapEditor } from 'solid-tiptap'
import { Doc } from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc'

import styles from '../components/editor.module.css'
import { createThemeCSSVars, getFontFamilies, loadFonts, Theme } from '../theme'
import { createTypographyCSSVars, Typography } from '../typography'
import { Cursor } from '../components'

type Settings = {
  element: HTMLElement
  docId: string
  theme?: Theme
  typography?: Partial<Typography>
}

/**
 * NOTE: This need to be in sync with `editor.module.css` to avoid any FOUC.
 */
const DEFAULT_TYPOGRAPHY: Typography = {
  rhythm: {
    baseSize: 20,
    leading: 1.6,
    lineLength: 60,
    scaleRatio: 1.25,
  },
}

const DEFAULT_THEME: Theme = {
  base: {
    family: 'Mulish',
  },
  em: {
    family: 'Mynerve',
    style: 'italic',
  },
  heading: {
    family: 'Lobster',
  },
  strong: {
    weight: 'bold',
  },
}

export function createEditor(settings: () => Settings): Accessor<Editor> {
  return createTiptapEditor(() => {
    let destroyCursor: VoidFunction
    const document = new Doc()
    new IndexeddbPersistence(settings().docId, document)
    const provider = new WebrtcProvider(settings().docId, document)

    const style = () => createEditorStyle(settings())

    onCleanup(() => {
      destroyCursor()
    })

    return {
      // TODO: save the position and set `autofocus` to it
      autofocus: true,
      editorProps: {
        attributes: {
          class: styles.editor,
          style: style(),
        },
      },
      element: settings().element,
      extensions: [
        Collaboration.configure({ document }),
        CollaborationCursor.configure({
          provider,
          render: user =>
            (
              createRoot(dispose => {
                destroyCursor = dispose
                return <Cursor name={user.name} color={user.color} />
              }) as JSX.FunctionElement
            )() as HTMLElement,
        }),
        Link,
        StarterKit.configure({ history: false }),
        TypographyExt,
        TaskList,
        TaskItem,
      ],
      injectCSS: false,
    }
  }) as Accessor<Editor>
}

function createEditorStyle(settings: Settings) {
  const theme = { ...DEFAULT_THEME, ...settings.theme }
  const typography = { ...DEFAULT_TYPOGRAPHY, ...settings.typography }

  createEffect(() => {
    const fontFamilies = getFontFamilies(theme)
    loadFonts(fontFamilies)
  })

  return createThemeCSSVars(theme) + createTypographyCSSVars(typography)
}
