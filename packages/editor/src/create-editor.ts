import Collaboration from '@tiptap/extension-collaboration'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TypographyExt from '@tiptap/extension-typography'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { createTiptapEditor } from 'solid-tiptap'

import styles from './editor.module.css'
import { createThemeCSSVars, getFontFamilies, loadFonts, Theme } from './theme'
import { createTypographyCSSVars, Typography } from './typography'
import { createEffect } from 'solid-js'

export type EditorSettings = {
  element: HTMLElement
  content?: string
  theme?: Theme
  typography?: Partial<Typography>
}

/**
 * NOTE: This need to be in sync with `editor.module.css` to avoid any FOUC.
 */
const DEFAULT_TYPOGRAPHY: Typography = {
  rhythm: {
    baseSize: 26,
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

export function createEditor(settings: () => EditorSettings) {
  return createTiptapEditor(() => {
    const provider = new HocuspocusProvider({
      url: 'ws://192.168.2.190:1234',
      name: 'main',
    })

    const style = () => createEditorStyle(settings())

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
        Collaboration.configure({
          document: provider.document,
        }),
        Link,
        StarterKit.configure({
          history: false,
        }),
        TypographyExt,
        TaskList,
        TaskItem,
      ],
      injectCSS: false,
    }
  })
}

function createEditorStyle(settings: EditorSettings) {
  const theme = { ...DEFAULT_THEME, ...settings.theme }
  const typography = { ...DEFAULT_TYPOGRAPHY, ...settings.typography }

  createEffect(() => {
    const fontFamilies = getFontFamilies(theme)
    loadFonts(fontFamilies)
  })

  return createThemeCSSVars(theme) + createTypographyCSSVars(typography)
}
