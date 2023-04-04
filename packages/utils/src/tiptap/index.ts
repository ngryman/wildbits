// import { Node } from '@tiptap/pm/model'
// import { Transaction } from '@tiptap/pm/state'
// import { Transform } from '@tiptap/pm/transform'

import { Transaction } from '@tiptap/pm/state'

export * from './marks'
export * from './nodes'
export * from './solid'

export function createInlineRegexp(parts: string[], flags?: string): RegExp {
  return new RegExp(['(?:^|\\s)', '(', ...parts, ')'].join(''), flags)
}

export function createInlineInputRegexp(parts: string[]): RegExp {
  return createInlineRegexp([...parts, '$'])
}

export function createInlinePasteRegexp(parts: string[]): RegExp {
  return createInlineRegexp(parts, 'g')
}

export function createInlineInputAndPasteRegexps(parts: string[]): [RegExp, RegExp] {
  return [createInlineInputRegexp(parts), createInlinePasteRegexp(parts)]
}

export function isChangeOrigin(transaction: Transaction): boolean {
  // https://github.com/yjs/y-prosemirror/blob/6349748b44859eacb8e54ef94757e2f59bb89113/src/plugins/keys.js
  return !!transaction.getMeta('y-sync$')
}

export function getChangesRange(transaction: Transaction): { from: number; to: number } {
  return transaction.mapping.maps.reduce(
    (range, stepMap) => {
      stepMap.forEach((_, __, from, to) => {
        if (from < range.from) {
          range.from = from
        }
        if (to > range.to) {
          range.to = to
        }
      })
      return range
    },
    { from: Infinity, to: 0 }
  )
}
