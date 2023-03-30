import { ActionsProps } from '@wildbits/utils'
import { CodeBlockAttributes } from '../extension'

export function exitOnArrowDown({ editor, type }: ActionsProps<CodeBlockAttributes>) {
  const { state } = editor
  const { selection, doc } = state
  const { $from, empty } = selection

  if (!empty || $from.parent.type !== type) return false

  const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
  if (!isAtEnd) return false

  const after = $from.after()
  const nodeAfter = doc.nodeAt(after)
  if (nodeAfter) return false

  return editor.commands.exitCode()
}
