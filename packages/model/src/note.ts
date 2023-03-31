import { ReactiveMap } from '@solid-primitives/map'
import { Accessor, createEffect } from 'solid-js'

import { createLocator, Locator } from '.'

export type Note = {
  id: string
  key: string
  title?: string
  path: string
  createdAt: number
}

export type NoteActions = {
  createNote(): Locator
  createNoteIfNotExists(locator: Locator): void
  deleteNote(id: string): void
  updateNoteTitle(id: string, title: string): void
}

export function createNotes(): [Accessor<Note[]>, NoteActions] {
  const notes = new ReactiveMap<string, Note>(JSON.parse(localStorage.getItem('notes')!) || [])

  const createNote = (): Locator => {
    const locator = createLocator()
    createNoteIfNotExists(locator)
    return locator
  }

  const createNoteIfNotExists = (locator: Locator) => {
    const { id: id, key } = locator
    if (!notes.has(id)) {
      notes.set(id, {
        id,
        key,
        path: `/${id}#${key}`,
        createdAt: Date.now(),
      })
    }
  }

  const deleteNote = async (id: string) => {
    notes.delete(id)
  }

  const updateNoteTitle = (id: string, title: string) => {
    if (notes.has(id)) {
      notes.set(id, { ...notes.get(id)!, title })
    }
  }

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify([...notes]))
  })

  return [
    () => [...notes.values()],
    { createNote, createNoteIfNotExists, deleteNote, updateNoteTitle },
  ]
}
