import { Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { css } from 'solid-styled-components'

const styles = {
  root: css`
    &[data-placeholder]::before {
      content: attr(data-placeholder);
      position: absolute;
      pointer-events: none;
      font-style: italic;
      color: #c9b08a;
    }
  `,
}

export function placeholder(text: string) {
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
        class: styles.root,
      },
    },
    view(view) {
      view
      update(view)
      return { update }
    },
  })
}
