import { posToDOMRect } from '@tiptap/core'
import { BubbleMenu } from '@wildbits/ui'
import { PluginViewProps } from '@wildbits/utils'
import { createMemo, For, Show } from 'solid-js'

import { FloatingMenuOptions } from '../extension'
import { ActionItem } from './action-item'

const emptyRect = new DOMRect(0, 0, 0, 0)

export function FloatingMenu(props: PluginViewProps<FloatingMenuOptions>) {
  const show = () =>
    !props.state.selection.empty && props.state.selection.$anchor.parent.isTextblock

  const bounds = createMemo(() =>
    show()
      ? posToDOMRect(props.editor.view, props.state.selection.from, props.state.selection.to)
      : emptyRect
  )

  return (
    <Show when={show()}>
      <BubbleMenu bounds={bounds()}>
        <For each={props.options.actions}>
          {action => <ActionItem action={action} editor={props.editor} state={props.state} />}
        </For>
      </BubbleMenu>
    </Show>
  )
}
