import { Editor } from '@tiptap/core'
import { EditorState } from '@tiptap/pm/state'
import { Button, Icons } from '@wildbits/ui'
import { titleCase } from '@wildbits/utils'
import { Action } from '../extension'

type Props = {
  action: Action
  editor: Editor
  state: EditorState
}

/**
 */
export function ActionItem(props: Props) {
  const titleCasedAction = titleCase(props.action)
  const commandName = `toggle${titleCasedAction}`
  // @ts-ignore
  const Icon = Icons[titleCasedAction]

  // NOTE: Gated by a non-empty selection for perf. `props.state` is needed to
  // trigger reactivity.
  const active = () =>
    !props.state.selection.empty ? props.state && props.editor.isActive(props.action) : false

  // NOTE: Gated by a non-empty selection for perf. `props.state` is needed to
  // trigger reactivity.
  const disabled = () =>
    !props.state.selection.empty
      ? // @ts-ignore
        props.state && !props.editor.can().chain().focus()[commandName]().run()
      : false

  // NOTE: `preventDefault` is used to avoid loosing the current selection.
  const toggleAction = (e: MouseEvent) => {
    e.preventDefault()
    // @ts-ignore
    props.editor.chain().focus()[commandName]().run()
  }

  return (
    <Button size="small" active={active()} disabled={disabled()} onClick={toggleAction}>
      <Icon />
    </Button>
  )
}
