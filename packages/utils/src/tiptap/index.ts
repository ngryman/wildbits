import { Transaction } from '@tiptap/pm/state'

export * from './marks'
export * from './nodes'
export * from './solid'

export type IdAttributes = {
  id: string
}

export function createInlineRegexp(parts: string[], suffix: string, flags?: string): RegExp {
  return new RegExp(['(?:^|\\s)', '(', ...parts, ')', suffix].join(''), flags)
}

export function createInlineInputRegexp(parts: string[]): RegExp {
  return createInlineRegexp(parts, '$')
}

export function createInlinePasteRegexp(parts: string[]): RegExp {
  return createInlineRegexp(parts, '', 'g')
}

export function createInlineInputAndPasteRegexps(parts: string[]): [RegExp, RegExp] {
  return [createInlineInputRegexp(parts), createInlinePasteRegexp(parts)]
}

export function isChangeOrigin(transaction: Transaction): boolean {
  // https://github.com/yjs/y-prosemirror/blob/6349748b44859eacb8e54ef94757e2f59bb89113/src/plugins/keys.js
  return !!transaction.getMeta('y-sync$')
}
