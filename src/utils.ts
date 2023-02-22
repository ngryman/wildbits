import { createSignal, Accessor, Setter } from 'solid-js'

export type Atom<T> = Accessor<T> & Setter<T>

export default function atom<T>(value: T): Atom<T> {
  const [state, setState] = createSignal(value)

  // XXX
  // @ts-ignore
  // eslint-disable-next-line solid/reactivity
  return value => {
    if (value !== undefined) {
      setState(value)
    }
    return state()
  }
}
