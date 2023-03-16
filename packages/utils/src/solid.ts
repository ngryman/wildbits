import {
  Accessor,
  createEffect,
  getOwner,
  JSX,
  onCleanup,
  ParentProps,
  runWithOwner,
  splitProps,
} from 'solid-js'
import { assign } from 'solid-js/web'

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

export type PassthroughProps<E extends Element> = { element: E } & ParentProps &
  JSX.HTMLAttributes<E>

export function Passthrough<E extends Element>(props: PassthroughProps<E>): E {
  const owner = getOwner()
  let content: JSX.Element

  createEffect(() => {
    content || (content = runWithOwner(owner, () => props.children))
    const [_, others] = splitProps(props, ['element'])
    const isSvg = props.element instanceof SVGElement
    assign(props.element, others, isSvg)
  })

  return props.element
}
