import { KatexAttributes } from '..'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    katex: {
      setKatex: (attrs?: KatexAttributes) => ReturnType
    }
  }
}
