import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export type Settings = {
  documentId: string
  cryptoKey: string
  signalingServer: string
}

export type Provider = {
  documentId: string
  document: Doc
  webrtcProvider: WebrtcProvider
}

export type User = {
  name: string
  color: string
}

export type Peer = {
  id: number
  user: User
}
