import { Document } from '@mindraft/editor-utils'

export type Persistence = {
  loadDocument(id: string): Promise<Document>
  saveDocument(id: string, doc: Document): Promise<void>
}
