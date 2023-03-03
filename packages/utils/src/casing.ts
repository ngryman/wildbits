export function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}
