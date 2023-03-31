import { nanoid } from 'nanoid'
import { createEffect } from 'solid-js'
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

export function createState(): [State, SetStoreFunction<State>] {
  const [state, setState] = createStore(loadState())

  createEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  })

  return [state, setState]
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
