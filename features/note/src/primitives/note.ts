import { ReactiveMap } from '@solid-primitives/map'
import { generateKey } from '@wildbits/utils'
import { nanoid } from 'nanoid'
import { Accessor, createEffect } from 'solid-js'

export class Locator {
  constructor(readonly id: string, readonly key: string) {}

  get path(): string {
    return `/${this.id}#${this.key}`
  }

  static async generate(): Promise<Locator> {
    return new Locator(nanoid(), await generateKey())
  }
}

export type Note = {
  id: string
  key: string
  title: string
  path: string
}

export type NoteActions = {
  createNote(): Promise<Locator>
  createNoteIfNotExists(locator: Locator): void
  deleteNote(id: string): void
  updateNoteTitle(id: string, title: string): void
}

export function createNotes(): [Accessor<Note[]>, NoteActions] {
  const notes = new ReactiveMap<string, Note>(JSON.parse(localStorage.getItem('notes')!) || [])

  const createNote = async (): Promise<Locator> => {
    const locator = await Locator.generate()
    createNoteIfNotExists(locator)
    return locator
  }

  const createNoteIfNotExists = (locator: Locator) => {
    const { id: id, key } = locator
    if (!notes.has(id)) {
      notes.set(id, {
        id,
        key,
        title: 'A new beginning',
        path: `/${id}#${key}`,
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
