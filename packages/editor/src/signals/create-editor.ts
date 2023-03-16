import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import StarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TypographyExt from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import { Editor } from '@tiptap/core'
import { Accessor, createComponent, createEffect, onCleanup } from 'solid-js'
import { createTiptapEditor, UseEditorOptions } from 'solid-tiptap'
import { IndexeddbPersistence } from 'y-indexeddb'

import styles from '../components/editor.module.css'
import { createThemeCSSVars, getFontFamilies, loadFonts, Theme } from '../theme'
import { createTypographyCSSVars, Typography } from '../typography'
import { Cursor } from '../components'
import { Layout } from '../extensions'
import { Settings } from './types'

/**
 * NOTE: This need to be in sync with `editor.module.css` to avoid any FOUC.
 */
const DEFAULT_TYPOGRAPHY: Typography = {
  rhythm: {
    baseSize: 20,
    leading: 1.6,
    lineLength: 80,
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
  const document = settings().provider.document
  const _persistence = new IndexeddbPersistence(
    settings().provider.documentId,
    document
  )

  return createTiptapEditor(() => {
    let destroyCursor: VoidFunction

    const props: UseEditorOptions<HTMLElement> = {
      // TODO: save the position and set `autofocus` to it
      autofocus: true,
      editorProps: {
        attributes: {
          class: styles.editor,
          style: createEditorStyle(settings()),
        },
      },
      element: settings().element,
      extensions: [
        Collaboration.configure({ document }),
        CollaborationCursor.configure({
          provider: settings().provider.webrtcProvider,
          render: user => {
            const el = createComponent(Cursor, {
              name: user.name,
              color: user.color,
            })
            // NOTE: In production, it returns a `JSX.FunctionElement`.
            // In development, it returns a `JSX.Element`. I'm not exactly sure
            // why but we need to treat `el` as a thunk to avoid any exception.
            return (typeof el === 'function' ? el() : el) as HTMLElement
          },
        }),
        Image.configure({ allowBase64: true }),
        Layout,
        Link,
        StarterKit.configure({ history: false }),
        TypographyExt,
        Table.configure({ allowTableNodeSelection: true, resizable: true }),
        TableCell,
        TableHeader,
        TableRow,
        TaskList,
        TaskItem,
        Youtube.configure({ modestBranding: true, width: 0, height: 0 }),
      ],
      injectCSS: false,
    }

    onCleanup(() => destroyCursor())

    return props
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
