import { ReactiveMap } from '@solid-primitives/map'
import { createEffect } from 'solid-js'

export type Locator = {
  noteId: string
  key: string
}

export type Note = {
  id: string
  key: string
  title: string
  path: string
}

export type Notes = {
  all(): Note[]
  delete(id: string): void
  setTitle(id: string, title: string): void
}

export function createNotes(): Notes {
  const notes = new ReactiveMap<string, Note>(JSON.parse(localStorage.getItem('notes')!) || [])

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify([...notes]))
  })

  return {
    all: () => [...notes.values()],
    delete(id) {
      notes.delete(id)
    },
    setTitle(id, title) {
      if (notes.has(id)) {
        notes.set(id, { ...notes.get(id)!, title })
      }
    },
  }
}
