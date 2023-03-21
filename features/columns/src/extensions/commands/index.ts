import { ColumnsAttributes } from '../columns'

export { gotoNextColumn } from './goto-next-column'
export { gotoPreviousColumn } from './goto-previous-column'
export { insertColumnAfter } from './insert-column-after'
export { insertColumnBefore } from './insert-column-before'
export { removeColumn } from './remove-column'
export { setColumns } from './set-columns'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      gotoNextColumn: () => ReturnType
      gotoPreviousColumn: () => ReturnType
      insertColumnAfter: () => ReturnType
      insertColumnBefore: () => ReturnType
      removeColumn: () => ReturnType
      setColumns: (attributes?: ColumnsAttributes) => ReturnType
    }
  }
}
