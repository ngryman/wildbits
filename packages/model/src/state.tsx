import { nanoid } from 'nanoid'
import { createContext, createEffect, ParentProps, useContext } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'

export type Locator = {
  id: string
  key: string
}

export type State = {
  locator: Locator
  pristine: boolean
  menuVisible: boolean
}

const StateContext = createContext<[State, SetStoreFunction<State>]>()

export function StateProvider(props: ParentProps) {
  const [state, setState] = createStore(loadState())

  createEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  })

  return <StateContext.Provider value={[state, setState]}>{props.children}</StateContext.Provider>
}

export function useState() {
  return useContext(StateContext)!
}

export function createLocator(id?: string, key?: string): Locator {
  return { id: id || nanoid(), key: key || nanoid() }
}

export function getLocatorPath(locator: Locator): string {
  return `/${locator.id}#${locator.key}`
}

function loadState(): State {
  try {
    return JSON.parse(localStorage.getItem('state')!) || getInitialState()
  } catch (e) {
    return getInitialState()
  }
}

function getInitialState(): State {
  return {
    pristine: true,
    locator: createLocator('welcome'),
    menuVisible: true,
  }
}
