import { Editor } from '@tiptap/core'
import { Attrs } from '@tiptap/pm/model'
import { EditorState } from '@tiptap/pm/state'
import { Button, Icons } from '@wildbits/ui'
import { createAtom, titleCase } from '@wildbits/utils'
import { createEffect, Show } from 'solid-js'
import { Action } from '../extension'
import { ActionForm } from './action-form'

type Props = {
  action: Action
  editor: Editor
  state: EditorState
}

export function ActionItem(props: Props) {
  const titleCasedAction = () => titleCase(props.action.name)
  // @ts-ignore
  const Icon = () => Icons[titleCasedAction()]

  const openForm = createAtom(false)

  // NOTE: Gated by a non-empty selection for perf. `props.state` is needed to
  // trigger reactivity.
  const active = () =>
    !props.state.selection.empty ? props.state && props.editor.isActive(props.action.name) : false

  // NOTE: Gated by a non-empty selection for perf. `props.state` is needed to
  // trigger reactivity.
  const disabled = () =>
    !props.state.selection.empty
      ? // @ts-ignore
        props.state && !props.editor.can().chain().focus()[props.action.command]().run()
      : false

  const runCommand = (command: string, attrs?: Attrs) => {
    let chain = props.editor.chain().focus()
    if (props.action.extend) {
      chain = chain.extendMarkRange(props.action.name)
    }
    // @ts-ignore
    chain[command](attrs).run()
  }

  // NOTE: `preventDefault` is used to avoid loosing the current selection.
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()

    if (props.action.fields.length === 0) {
      runCommand(props.action.command)
    } else {
      openForm(true)
    }
  }

  const attrs = () => props.editor.getAttributes(props.action.name)

  const runAndClose = (attrs: Attrs) => {
    if (props.action.commandIf) {
      const [predicate, command] = props.action.commandIf
      if (predicate(attrs)) {
        runCommand(command, attrs)
        return
      }
    }

    runCommand(props.action.command, attrs)
    openForm(false)
  }

  createEffect(() => {
    if (openForm()) {
      console.log(props.state.selection)
    }
  })

  return (
    <>
      <Button size="small" active={active()} disabled={disabled()} onClick={handleClick}>
        <Icon />
      </Button>
      <Show when={openForm()}>
        <ActionForm fields={props.action.fields} initialAttrs={attrs()} onChange={runAndClose} />{' '}
      </Show>
    </>
  )
}
