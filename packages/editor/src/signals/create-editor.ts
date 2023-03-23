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
import { Columns } from '@wildbits/columns'
import { Media } from '@wildbits/media'
import { Prose } from '@wildbits/prose'
import { createEffect, onCleanup } from 'solid-js'
import { IndexeddbPersistence } from 'y-indexeddb'

import styles from '../components/editor-view.module.css'
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
      family: 'Noto Serif',
      // family: 'Droid Serif',
      // family: 'Mulish',
    },
    code: {
      family: 'Inconsolata',
    },
    em: {
      family: 'Mynerve',
      style: 'italic',
    },
    heading: {
      // family: 'Lobster',
      weight: 'bold',
    },
    link: {
      color: '#f44336',
    },
    strong: {
      weight: 'bold',
    },
  },
}

export function createEditor(settings: Settings): Editor {
  const { provider } = settings
  const { documentId, document } = provider
  new IndexeddbPersistence(documentId, document)

  const editor = new Editor({
    // TODO: save the position and set `autofocus` to it
    autofocus: true,
    editorProps: {
      attributes: {
        class: styles.editor,
        style: createEditorStyle(settings),
      },
    },
    extensions: [
      Collaboration.configure({ provider }),
      Columns,
      Prose,
      Media,
      StarterKit.configure({
        gapcursor: false,
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
  })

  onCleanup(() => {
    editor.destroy()
  })

  // Expose the editor globally in development mode for debugging purpose.
  if (import.meta.env.DEV) {
    window.editor = editor
  }

  return editor
}

function createEditorStyle(settings: Settings) {
  const theme = { ...DEFAULT_THEME, ...settings.theme }
  const typography = { ...DEFAULT_TYPOGRAPHY, ...settings.typography }

  createEffect(() => {
    loadFonts(theme)
  })

  return createThemeCSSVars(theme) + createTypographyCSSVars(typography)
}
