import { Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { css } from 'goober'

const styles = {
  editor: css`
    &[data-placeholder]::before {
      content: attr(data-placeholder);
      position: absolute;
      pointer-events: none;
      font-style: italic;
      color: #c9b08a;
    }
  `,
}

export function placeholderPlugin(text: string) {
  function update(view: EditorView) {
    if (view.state.doc.textContent) {
      view.dom.removeAttribute('data-placeholder')
    } else {
      view.dom.setAttribute('data-placeholder', text)
    }
  }

  return new Plugin({
    props: {
      attributes: {
        class: styles.editor,
      },
    },
    view(view) {
      update(view)
      return { update }
    },
  })
}
