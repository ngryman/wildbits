import { createEffect } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { Doc } from 'yjs'

export class Note {
  constructor(
    public readonly id: string,
    public readonly key: string,
    public title: string,
    public readonly doc: Doc
  ) {}

  get path(): string {
    return `/${this.id}#${this.key}`
  }
}

export type Notes = {
  all: () => Note[]
  setTitle: (id: string, title: string) => void
}

export function createNotes(): Notes {
  const initialNotes: Note[] = JSON.parse(localStorage.getItem('notes')!) || []
  const [notes, setNotes] = createStore(initialNotes)

  createEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  })

  return {
    all: () => notes,
    setTitle: (id, title) => {
      setNotes(
        produce(notes => {
          const note = notes.find(note => note.id === id)
          if (note) {
            note.title = title
          }
        })
      )
    },
  }
}
