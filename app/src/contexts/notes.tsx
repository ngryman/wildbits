import { createContext, useContext, type ParentProps } from 'solid-js'
import {
  createStore,
  produce,
  type Store,
  type SetStoreFunction,
} from 'solid-js/store'
import { Node } from 'prosemirror-model'

export type Note = {
  from: number
  to: number
  doc: Node
}

export class NoteStore {
  private notes: Store<Note[]>
  private setNotes: SetStoreFunction<Note[]>

  constructor(initialNotes: Note[]) {
    const [notes, setNotes] = createStore(initialNotes)
    this.notes = notes
    this.setNotes = setNotes
  }

  get length() {
    return this.notes.length
  }

  get(index: number): Note {
    return this.notes[index]
  }

  create(note: Note) {
    this.setNotes(
      produce(notes => {
        notes.push(note)
      })
    )
  }

  updateNoteDoc(index: number, doc: Node) {
    this.setNotes(
      produce(notes => {
        notes[index].doc = doc
      })
    )
  }

  map<T>(callback: (value: Note, index: number, array: Note[]) => T): T[] {
    return this.notes.map(callback)
  }

  noteIndexAtPos(pos: number): number {
    return this.notes.findIndex(note => pos >= note.from && pos <= note.to)
  }
}

const NotesContext = createContext<NoteStore>()

export type NotesProps = ParentProps & {
  notes: Note[]
}

export function NotesProvider(props: NotesProps) {
  const store = () => new NoteStore(props.notes)

  return (
    <NotesContext.Provider value={store()}>
      {props.children}
    </NotesContext.Provider>
  )
}

export function useNotes(): NoteStore {
  return useContext(NotesContext)!
}
