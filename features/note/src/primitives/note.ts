import { ReactiveMap } from '@solid-primitives/map'
import { Accessor, createEffect } from 'solid-js'

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

export type NoteActions = {
  createNoteIfNotExists(locator: Locator): void
  deleteNote(id: string): void
  updateNoteTitle(id: string, title: string): void
}

export function createNotes(): [Accessor<Note[]>, NoteActions] {
  const notes = new ReactiveMap<string, Note>(JSON.parse(localStorage.getItem('notes')!) || [])

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify([...notes]))
  })

  return [
    () => [...notes.values()],
    {
      createNoteIfNotExists(locator) {
        const { noteId: id, key } = locator
        if (!notes.has(id)) {
          notes.set(id, {
            id,
            key,
            title: 'A new beginning',
            path: `/${id}#${key}`,
          })
        }
      },
      deleteNote(id) {
        notes.delete(id)
      },
      updateNoteTitle(id, title) {
        if (notes.has(id)) {
          notes.set(id, { ...notes.get(id)!, title })
        }
      },
    },
  ]
}
