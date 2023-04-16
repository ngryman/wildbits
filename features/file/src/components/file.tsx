import { NodeViewProps } from '@wildbits/utils'

import { FileAttributes } from '..'

export function File(props: NodeViewProps<FileAttributes>) {
  return <div>This is a file</div>
}

async function oldUploadFile(file: File) {
  const body = new FormData()
  body.append('file', file)

  const res = await fetch('/', {
    method: 'POS',
    body,
  })
  console.log(res)
}
