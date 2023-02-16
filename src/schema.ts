import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'

const nodes: Record<string, NodeSpec> = {
  /// The top level document node.
  doc: { content: 'block+' },

  /// A plain paragraph text block.
  /// Represented in the DOM as a `<p>` element.
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0],
  },

  /// A heading text block, with a `level` attribute that should hold the number 1 to 6.
  /// Parsed and serialized as `<h1>` to `<h6>` elements.
  heading: {
    attrs: { level: { default: 1 } },
    content: 'inline*',
    group: 'block',
    defining: true,
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM: node => ['h' + node.attrs.level, 0],
  },

  /// The text node.
  text: {
    group: 'inline',
  },

  /// A hard line break, represented in the DOM as `<br>`.
  hard_break: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM: () => ['br'],
  },
}

const marks: Record<string, MarkSpec> = {
  /// An emphasis mark. Rendered as an `<em>` element.
  /// Has parse rules that also match `<i>` and `font-style: italic`.
  em: {
    parseDOM: [
      { tag: 'i' },
      { tag: 'em' },
      { style: 'font-style=italic' },
      { style: 'font-style=normal', clearMark: m => m.type.name == 'em' },
    ],
    toDOM: () => ['em', 0],
  },

  /// A strong mark. Rendered as `<strong>`, parse rules also match `<b>` and `font-weight: bold`.
  strong: {
    parseDOM: [
      { tag: 'strong' },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      {
        tag: 'b',
        getAttrs: node =>
          (node as HTMLElement).style.fontWeight !== 'normal' && null,
      },
      { style: 'font-weight=400', clearMark: m => m.type.name == 'strong' },
      {
        style: 'font-weight',
        getAttrs: value =>
          /^(bold(er)?|[5-9]\d{2,})$/.test(value as string) && null,
      },
    ],
    toDOM: () => ['strong', 0],
  },
}

export const schema = new Schema({ nodes, marks })
