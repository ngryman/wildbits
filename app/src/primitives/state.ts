import { createEffect } from 'solid-js'
import { createStore, SetStoreFunction } from 'solid-js/store'

export type State = {
  pristine: boolean
}

const initialState: State = {
  pristine: true,
}

export function createState(): [State, SetStoreFunction<State>] {
  const [state, setState] = createStore(getInitialState())

  createEffect(() => {
    localStorage.setItem('state', JSON.stringify(state))
  })

  return [state, setState]
}

function getInitialState(): State {
  try {
    return JSON.parse(localStorage.getItem('state')!) || initialState
  } catch (e) {
    return initialState
  }
}
