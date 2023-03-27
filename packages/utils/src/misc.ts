export function times<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i))
}

export function debounce<T extends (...args: any[]) => ReturnType<T>>(
  callback: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback(...args), timeout)
  }
}

export function titleCase(text: string): string {
  return text.replace(/(?:^|[\s])([a-z])/g, (_, c) => c.toUpperCase())
}
