import { ColumnsAttributes } from '../columns'

export { gotoNextColumn } from './goto-next-column'
export { gotoPreviousColumn } from './goto-previous-column'
export { setColumns } from './set-columns'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    columns: {
      gotoNextColumn: () => ReturnType
      gotoPreviousColumn: () => ReturnType
      setColumns: (attributes?: ColumnsAttributes) => ReturnType
    }
  }
}
