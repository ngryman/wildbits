import {
  createResource,
  createSignal,
  Accessor,
  InitializedResource,
  ResourceFetcher,
  Setter,
} from 'solid-js'

export type Atom<T, A extends VoidFunction = Accessor<T>> = A & Setter<T>

export function createAtom<T>(value: T): Atom<T> {
  const [state, setState] = createSignal(value)

  return createAtomFunction(state, setState)
}

export function createInitializedResourceAtom<T>(
  fetcher: ResourceFetcher<true, T, unknown>,
  value: T
): Atom<T, InitializedResource<T>> {
  const [resource, { mutate }] = createResource<T>(fetcher, {
    initialValue: value,
  })

  return createAtomFunction(resource, mutate)
}

function createAtomFunction<T, A extends VoidFunction>(
  accessor: A,
  setter: Setter<T>
): Atom<T, A> {
  return (value => {
    if (value !== undefined) {
      setter(value)
    }
    return accessor()
  }) as Atom<T, A>
}
