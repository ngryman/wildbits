import { css } from 'solid-styled-components'
import { Decoration, DecorationSet, EditorProps } from 'prosemirror-view'

import type { NoteStore } from 'contexts/notes'

import { StateStore } from '../state'

const styles = {
  selection: css`
    padding: 0.3rem 0;
    background: #f6e7c966;
    color: inherit;
    transition: all 100ms ease-in-out;

    &:hover {
      background: #f6e7c9;
    }
  `,
}

export function createPluginProps(
  state: StateStore,
  notes: NoteStore
): EditorProps {
  return {
    handleDOMEvents: {
      click(_view, event) {
        // Prevent the click to propagate. This is necessary so we don't
        // instantaneously hide the note.
        //
        // NOTE: We do this here and not in `props.handleClick` because
        // it doesn't seem to stop the actual propagation of the event.
        event.stopPropagation()
      },
      mouseup(view) {
        if (view.state.selection.empty) return
        const { from, to } = view.state.selection

        // Get the top coord of the selection
        const selection = window.getSelection()!
        const range = selection.getRangeAt(0).cloneRange()
        range.collapse(true)
        const top = range.getClientRects()[0].top

        state.create(from, to, top)
      },
    },
    handleClick(view, pos, event) {
      const index = notes.noteIndexAtPos(pos)
      if (index === -1) {
        return state.hide()
      }

      const target = event.target as HTMLElement
      // Check that the click is in an editor node (eg. paragraph)
      // and not in the editor's `div` itself. Otherwise, it moves
      // the comment to the top of the editor.
      const { node } = view.domAtPos(pos)
      if (!node.contains(target)) return
      const top = target.getBoundingClientRect().top
      state.update(index, top)
    },
    decorations(editorState) {
      if (notes.length === 0) return DecorationSet.empty
      const decorations = notes.map(note =>
        Decoration.inline(note.from, note.to, {
          class: styles.selection,
          nodeName: 'mark',
        })
      )
      return DecorationSet.create(editorState.doc, decorations)
    },
  }
}
