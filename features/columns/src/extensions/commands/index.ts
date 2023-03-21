import { ColumnsAttributes } from '../columns'

export { deleteColumn } from './delete-column'
export { gotoNextColumn } from './goto-next-column'
export { gotoPreviousColumn } from './goto-previous-column'
export { insertColumnAfter } from './insert-column-after'
export { insertColumnBefore } from './insert-column-before'
export { setColumns } from './set-columns'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      deleteColumn: () => ReturnType
      gotoNextColumn: () => ReturnType
      gotoPreviousColumn: () => ReturnType
      insertColumnAfter: () => ReturnType
      insertColumnBefore: () => ReturnType
      setColumns: (attributes?: ColumnsAttributes) => ReturnType
    }
  }
}
