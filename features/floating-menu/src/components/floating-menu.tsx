import { findParentNodeClosestToPos, isTextSelection } from '@tiptap/core'
import { BubbleMenu } from '@wildbits/ui'
import { PluginViewProps } from '@wildbits/utils'
import { createMemo, For, Show } from 'solid-js'

import { FloatingMenuOptions } from '../extension'
import { ActionItem } from './action-item'

const emptyRect = new DOMRect(0, 0, 0, 0)

export function FloatingMenu(props: PluginViewProps<FloatingMenuOptions>) {
  const show = () => {
    const { doc, selection } = props.state
    const { $anchor, empty, from, to } = selection

    // NOTE: Sometime check for `empty` is not enough. For example, double
    // clicking an empty paragraph returns a node size of 2. So we also check
    // for an empty text size.
    const isEmptyTextBlock =
      !doc.textBetween(from, to).length && isTextSelection(props.state.selection)

    // Hide in code blocks.
    // TODO: We might want to provide a way to configure that instead of hard
    // coding it here.
    const isInCodeBlock = Boolean(
      findParentNodeClosestToPos($anchor, node => node.type.name === 'codeBlock')
    )

    return props.editor.view.hasFocus() && !empty && !isEmptyTextBlock && !isInCodeBlock
  }

  const bounds = createMemo<DOMRect>(prevBounds => {
    if (!show()) return emptyRect

    const { view } = props.editor
    const { selection } = props.state
    const { from, to } = selection

    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to, -1)
    const top = Math.min(start.top, end.top)

    if (start.top === end.top || top !== prevBounds.top) {
      return new DOMRect(
        Math.min(start.left, end.left),
        start.top + window.scrollY,
        Math.abs(end.right - start.left),
        Math.abs(end.bottom - start.top)
      )
    }

    return prevBounds
  }, emptyRect)

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
