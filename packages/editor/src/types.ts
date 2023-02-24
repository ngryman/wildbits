import { Command } from 'prosemirror-state'

export type Document = {
  type: 'doc'
  content: Block[]
}

export type Block = HeadingBlock | ParagraphBlock | TextBlock

export type HeadingBlock = {
  type: 'heading'
  attrs: {
    level: number
  }
  content: [TextBlock]
}

export type ParagraphBlock = {
  type: 'paragraph'
  content: [TextBlock]
}

export type TextBlock = {
  type: 'text'
  text: string
}

export type Bindings = Record<string, Command>
