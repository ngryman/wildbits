export function times<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i))
}

export function foldTimes<T, U>(n: number, fn: (acc: U, i: number) => U, init: U): U {
  return times(n, i => i).reduce(fn, init)
}

export function debounce<T extends (...args: any[]) => ReturnType<T>>(
  fn: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), timeout)
  }
}

export function titleCase(text: string): string {
  return text.replace(/(?:^|[\s])([a-z])/g, (_, c) => c.toUpperCase())
}
