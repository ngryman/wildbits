import { Accessor, onCleanup } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      clickOutside: VoidFunction
    }
  }
}

export function clickOutside(el: HTMLElement, accessor: Accessor<VoidFunction | undefined>) {
  const onClick = (e: MouseEvent) => !el.contains(e.target as Node) && accessor()?.()
  document.body.addEventListener('click', onClick)

  onCleanup(() => document.body.removeEventListener('click', onClick))
}
