import { ReactiveMap } from '@solid-primitives/map'
import { createEffect } from 'solid-js'

export type Note = {
  id: string
  title: string
  path: string
}

export type Notes = {
  all: () => Note[]
  setTitle: (id: string, title: string) => void
}

export function createNotes(): Notes {
  const notes = new ReactiveMap<string, Note>(JSON.parse(localStorage.getItem('notes')!) || [])

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify([...notes]))
  })

  return {
    all: () => [...notes.values()],
    setTitle: (id, title) => {
      notes.set(id, { id, title, path: location.pathname + location.hash })
    },
  }
}
