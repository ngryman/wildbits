import { findParentNodeClosestToPos, isTextSelection } from '@tiptap/core'
import { BubbleMenu } from '@wildbits/ui'
import { PluginViewProps } from '@wildbits/utils'
import { createMemo, For, on, Show } from 'solid-js'

import { Action } from '../extension'
import { ActionItem } from './action-item'

type Props = {
  actions: Action[]
}

const emptyRect = new DOMRect(0, 0, 0, 0)

export function FloatingMenu(props: PluginViewProps<Props>) {
  const show = createMemo(
    on(
      () => props.state.selection,
      () => {
        const { doc, selection } = props.state
        const { $anchor, empty, from, to } = selection

        // Bail out if the selection is empty...
        if (empty) return false
        // ...or it's not a text selection...
        if (!isTextSelection(selection)) return false
        // ...or the selected text is not empty...
        // NOTE: Sometime check for `empty` is not enough. For example, double
        // clicking an empty paragraph returns a node size of 2. So we also check
        // for an empty text size.
        if (doc.textBetween(from, to).length === 0) return false
        // ...or we're in a code block
        // TODO: We might want to provide a way to configure that instead of hard
        // coding it here.
        if (findParentNodeClosestToPos($anchor, node => node.type.name === 'codeBlock'))
          return false

        return true
      }
    ),
    false
  )

  const bounds = createMemo<DOMRect>(prevBounds => {
    if (!show()) return emptyRect

    const { view } = props.editor
    const { selection } = props.state
    const { from, to } = selection

    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to, -1)
    const top = Math.min(start.top, end.top) + window.scrollY

    // Compute new bounds if we're on the same line or if we go upwards.
    if (start.top === end.top || top !== prevBounds.top) {
      return new DOMRect(
        Math.min(start.left, end.left),
        top,
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
