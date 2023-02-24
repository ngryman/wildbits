import { createContext, useContext } from 'solid-js'

import { atom, type Atom } from 'utils'

export type State = CreateState | UpdateState | HiddenState

export type CreateState = {
  mode: 'create'
  from: number
  to: number
  top: number
}

export type UpdateState = {
  mode: 'update'
  index: number
  top: number
}

export type HiddenState = {
  mode: 'hidden'
}

export class StateStore {
  private initialState: State
  private atom: Atom<State>

  constructor(initialState: State) {
    this.initialState = initialState
    this.atom = atom(initialState)
  }

  get(): State {
    return this.atom()
  }

  set(state: State) {
    this.atom(state)
  }

  create(from: number, to: number, top: number) {
    this.atom({ mode: 'create', from, to, top })
  }

  update(index: number, top?: number) {
    this.atom(prev => {
      top ||= prev.mode !== 'hidden' ? prev.top : 0
      return { mode: 'update', index, top }
    })
  }

  hide() {
    this.atom({ mode: 'hidden' })
  }

  reset() {
    this.set(this.initialState)
  }
}

export function createState(initialState: State): StateStore {
  return new StateStore(initialState)
}

export const StateContext = createContext<StateStore>()

export function useState() {
  return useContext(StateContext)!
}
