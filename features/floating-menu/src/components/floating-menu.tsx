import { posToDOMRect, isTextSelection } from '@tiptap/core'
import { BubbleMenu } from '@wildbits/ui'
import { PluginViewProps } from '@wildbits/utils'
import { createMemo, For, Show } from 'solid-js'

import { FloatingMenuOptions } from '../extension'
import { ActionItem } from './action-item'

const emptyRect = new DOMRect(0, 0, 0, 0)

export function FloatingMenu(props: PluginViewProps<FloatingMenuOptions>) {
  const show = () => {
    const { doc, selection } = props.state
    const { empty, from, to } = selection

    // NOTE: Sometime check for `empty` is not enough. For example, double
    // clicking an empty paragraph returns a node size of 2. So we also check
    // for an empty text size.
    const isEmptyTextBlock =
      !doc.textBetween(from, to).length && isTextSelection(props.state.selection)

    return props.editor.view.hasFocus() && !empty && !isEmptyTextBlock
  }

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
