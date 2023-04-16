import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { createActionCommand, createNodeView } from '@wildbits/utils'

import { File as FileView } from './components'

import * as actions from './actions'

export type FileOptions = {
  HTMLAttributes: Record<string, unknown>
}

export type FileAttributes = {
  name: string
  type: string
  size: number
  status: 'uploading' | 'ready'
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    file: {
      setFile: (attrs?: FileAttributes) => ReturnType
    }
  }
}

export const File = Node.create<FileOptions>({
  name: 'file',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-filename]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setFile: params => createActionCommand(this, actions.setFile, params),
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files?.length ?? false
              if (!hasFiles) return

              const files = Array.from(event.dataTransfer!.files).filter(
                file => !file.type.startsWith('image')
              )
              if (files.length === 0) return

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY })!

              for (const file of files) {
                uploadFile(file)
                const node = schema.nodes.file.create({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  status: 'uploading',
                })
                const tr = view.state.tr.insert(coordinates.pos, node)
                view.dispatch(tr)
              }
            },
          },
        },
      }),
    ]
  },

  addNodeView() {
    return createNodeView(FileView)
  },
})

async function uploadFile(file: File) {
  const signedUrl = await fetch(
    `https://sign-url.ngryman.workers.dev/${file.name}?type=${file.type}&size=${file.size}`,
    {
      mode: 'cors',
    }
  ).then(res => res.text())

  const xhr = new XMLHttpRequest()
  xhr.open('PUT', signedUrl, true)
  xhr.setRequestHeader('Content-Type', file.type)

  return new Promise((resolve, reject) => {
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) {
        console.log(e.loaded / e.total)
      }
    })
    xhr.addEventListener('loadend', () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(null)
      }
    })
    xhr.addEventListener('error', e => {
      reject(e)
    })
    xhr.send(file)
  })
}
