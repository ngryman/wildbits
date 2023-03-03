import { toKebabCase } from './casing'

export function toCSSVars(obj: Record<string, unknown>): string {
  return Object.entries(obj).reduce(
    (css, [key, val]) => css + `--${toKebabCase(key)}: ${val};`,
    ''
  )
}
