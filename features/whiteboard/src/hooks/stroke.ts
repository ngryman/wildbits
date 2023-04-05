import { createStore } from 'solid-js/store'
import { Array as YArray, Doc as YDoc, UndoManager as YUndoManager } from 'yjs'

import { Point, Stroke } from '../types'

export type StrokeActions = {
  startStroke(): void
  addPointToStroke(point: Point): void
  finishStroke(): void
  undoStroke(): void
  redoStroke(): void
  clearStrokes(): void
}

export function useStrokes(doc: YDoc, id: string): [Stroke[], StrokeActions] {
  let currentIndex = -1
  const boards = doc.getMap<YArray<YArray<Point>>>('boards')
  const board = boards.get(id) || boards.set(id, new YArray())
  const undoManager = new YUndoManager(board)
  const [strokes, setStrokes] = createStore<Stroke[]>(board.toJSON())

  board.observeDeep(() => {
    setStrokes(board.toJSON())
  })

  const startStroke = () => {
    currentIndex = board.length
    board.push([new YArray()])
  }

  const addPointToStroke = (point: Point) => {
    if (currentIndex === -1) return
    board.get(currentIndex).push([point])
  }

  const finishStroke = () => {
    if (currentIndex === -1) return
    currentIndex = -1
  }

  const undoStroke = () => {
    undoManager.undo()
  }

  const redoStroke = () => {
    undoManager.redo()
  }

  const clearStrokes = () => {
    while (board.length > 0) {
      board.delete(board.length - 1)
    }
  }

  return [
    strokes,
    {
      startStroke,
      addPointToStroke,
      finishStroke,
      undoStroke,
      redoStroke,
      clearStrokes,
    },
  ]
}
