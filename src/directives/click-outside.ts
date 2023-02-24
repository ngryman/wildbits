import { Accessor, onCleanup } from 'solid-js'

export default function clickOutside(
  el: HTMLElement,
  accessor: Accessor<VoidFunction>
) {
  function handleClick(e: MouseEvent) {
    if (!el.contains(e.target as HTMLElement)) {
      accessor()?.()
    }
  }

  document.body.addEventListener('click', handleClick)
  onCleanup(() => document.body.removeEventListener('click', handleClick))
}

declare module 'solid-js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    export interface Directives {
      clickOutside: VoidFunction
    }
  }
}
