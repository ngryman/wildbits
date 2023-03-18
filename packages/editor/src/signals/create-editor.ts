import { Image } from '@tiptap/extension-image'
import { StarterKit } from '@tiptap/starter-kit'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Typography as TypographyExtension } from '@tiptap/extension-typography'
import { Youtube } from '@tiptap/extension-youtube'
import { Editor } from '@tiptap/core'
import { Collaboration } from '@wildbits/collaboration'
import { Layout } from '@wildbits/layout'
import { Prose } from '@wildbits/prose'
import { Accessor, createEffect } from 'solid-js'
import { createTiptapEditor, UseEditorOptions } from 'solid-tiptap'
import { IndexeddbPersistence } from 'y-indexeddb'

import styles from '../components/editor.module.css'
import { createThemeCSSVars, loadFonts, Theme } from '../theme'
import { createTypographyCSSVars, Typography } from '../typography'
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
  caret: {
    color: '#f44336',
  },
  list: {
    markerColor: '#f44336',
  },
  fonts: {
    base: {
      family: 'Mulish',
    },
    code: {
      family: 'Inconsolata',
    },
    em: {
      family: 'Mynerve',
      style: 'italic',
    },
    heading: {
      family: 'Lobster',
    },
    link: {
      color: '#f44336',
    },
    strong: {
      weight: 'bold',
    },
  },
}

export function createEditor(settings: () => Settings): Accessor<Editor> {
  const provider = settings().provider
  const _persistence = new IndexeddbPersistence(provider.documentId, provider.document)

  return createTiptapEditor(() => {
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
        Collaboration.configure({ provider }),
        Prose,
        Image.configure({ allowBase64: true }),
        Layout,
        StarterKit.configure({
          history: false,
          bold: false,
          italic: false,
          horizontalRule: false,
        }),
        TypographyExtension,
        Table.configure({ allowTableNodeSelection: true, resizable: true }),
        TableCell,
        TableHeader,
        TableRow,
        TaskList,
        TaskItem.configure({ nested: true }),
        Youtube.configure({ modestBranding: true, width: 0, height: 0 }),
      ],
      injectCSS: false,
    }

    return props
  }) as Accessor<Editor>
}

function createEditorStyle(settings: Settings) {
  const theme = { ...DEFAULT_THEME, ...settings.theme }
  const typography = { ...DEFAULT_TYPOGRAPHY, ...settings.typography }

  createEffect(() => {
    loadFonts(theme)
  })

  return createThemeCSSVars(theme) + createTypographyCSSVars(typography)
}
