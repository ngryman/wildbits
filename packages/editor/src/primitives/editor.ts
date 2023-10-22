import { Accessor, createEffect, createMemo, onCleanup } from 'solid-js'

import { Editor } from '@tiptap/core'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import { Typography as TypographyExtension } from '@tiptap/extension-typography'
import { Youtube } from '@tiptap/extension-youtube'
import { StarterKit } from '@tiptap/starter-kit'
import { CodeBlock } from '@wildbits/code'
import { Collaboration, Provider } from '@wildbits/collaboration'
import { Columns } from '@wildbits/columns'
import { UniqueId } from '@wildbits/core'
import { FloatingMenu } from '@wildbits/floating-menu'
import { Image } from '@wildbits/image'
import { Katex } from '@wildbits/katex'
import { Prose } from '@wildbits/prose'
import { Whiteboard } from '@wildbits/whiteboard'

import styles from '../components/editor-view.module.css'
import { Metadata } from '../extensions'
import { Theme, createThemeCSSVars, loadFonts } from '../theme'
import { Typography, createTypographyCSSVars } from '../typography'

export type EditorOptions = {
  provider: Accessor<Provider>
  theme?: Theme
  typography?: Partial<Typography>
}

/**
 * NOTE: This need to be in sync with `editor.module.css` to avoid any FOUC.
 */
const DEFAULT_TYPOGRAPHY: Typography = {
  rhythm: {
    baseSize: 20,
    leading: 1.8,
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
      family: 'Plus Jakarta Sans',
      weight: 'bolder',
    },
    link: {
      color: '#f44336',
    },
    strong: {
      weight: 'bold',
    },
  },
}

export function createEditor(options: EditorOptions): Accessor<Editor> {
  const editor = createMemo<Editor>(prevEditor => {
    if (prevEditor) {
      prevEditor.destroy()
    }

    const editor = new Editor({
      // TODO: save the position and set `autofocus` to it
      editorProps: {
        attributes: {
          class: styles.editor,
          style: createEditorStyle(options),
        },
      },
      extensions: [
        CodeBlock,
        Collaboration.configure({ provider: options.provider() }),
        Columns,
        FloatingMenu.configure({
          actions: [
            'bold',
            'italic',
            'underline',
            'strike',
            'code',
            {
              name: 'link',
              command: 'setLink',
              commandIf: [attrs => !attrs.href, 'unsetLink'],
              extend: true,
              fields: [{ key: 'href', name: 'URL' }],
            },
          ],
        }),
        Image,
        Katex,
        Prose,
        Metadata,
        StarterKit.configure({
          bold: false,
          bulletList: false,
          codeBlock: false,
          gapcursor: false,
          heading: false,
          history: false,
          horizontalRule: false,
          italic: false,
        }),
        TypographyExtension,
        Table.configure({ allowTableNodeSelection: true, resizable: true }),
        TableCell,
        TableHeader,
        TableRow,
        TaskList,
        TaskItem.configure({ nested: true }),
        UniqueId.configure({ types: ['codeBlock', 'heading', 'image', 'paragraph', 'whiteboard'] }),
        Whiteboard,
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
  })

  return editor
}

function createEditorStyle(options: EditorOptions) {
  const theme = { ...DEFAULT_THEME, ...options.theme }
  const typography = { ...DEFAULT_TYPOGRAPHY, ...options.typography }

  createEffect(() => {
    loadFonts(theme)
  })

  return createThemeCSSVars(theme) + createTypographyCSSVars(typography)
}
