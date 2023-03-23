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
