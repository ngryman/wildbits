import { ActionsProps } from '@wildbits/utils'
import { CodeBlockAttributes } from '../extension'

export function exitOnTripleEnter({ type, editor }: ActionsProps<CodeBlockAttributes>): boolean {
  const { state } = editor
  const { selection } = state
  const { $from, empty } = selection

  if (!empty || $from.parent.type !== type) return false

  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
  const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')
  if (!isAtEnd || !endsWithDoubleNewline) return false

  return editor
    .chain()
    .command(({ tr }) => {
      tr.delete($from.pos - 2, $from.pos)
      return true
    })
    .exitCode()
    .run()
}
