import { ReactiveMap } from '@solid-primitives/map'
import { createContext, createEffect, ParentProps, useContext } from 'solid-js'

import { Locator } from '.'

// import { createLocator, Locator } from '.'

export type Note = {
  id: string
  key: string
  title?: string
  path: string
  createdAt: number
}

// export type NoteActions = {
//   createNote(locator?: Locator): Locator
//   deleteNote(id: string): void
//   updateNoteTitle(id: string, title: string): void
// }

export type Notes = ReactiveMap<string, Note>

const NotesContext = createContext<Notes>()

export function NotesProvider(props: ParentProps) {
  const notes = new ReactiveMap<string, Note>(loadNotes())

  // const actions: NoteActions = {
  //   createNote(locator = createLocator()) {
  //     const { id: id, key } = locator
  //     if (!notes.has(id)) {
  //       notes.set(id, {
  //         id,
  //         key,
  //         path: `/${id}#${key}`,
  //         createdAt: Date.now(),
  //       })
  //     }
  //     return locator
  //   },
  //   deleteNote(id: string) {
  //     notes.delete(id)
  //   },
  //   updateNoteTitle(id: string, title: string) {
  //     if (notes.has(id)) {
  //       notes.set(id, { ...notes.get(id)!, title })
  //     }
  //   },
  // }

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify([...notes]))
  })

  return <NotesContext.Provider value={notes}>{props.children}</NotesContext.Provider>
}

export function useNotes(): Notes {
  return useContext(NotesContext)!
}

export function createNote(locator: Locator): Note {
  const { id: id, key } = locator
  return {
    id,
    key,
    path: `/${id}#${key}`,
    createdAt: Date.now(),
  }
}

function loadNotes(): [string, Note][] {
  try {
    return JSON.parse(localStorage.getItem('notes')!) || []
  } catch (e) {
    return []
  }
}
