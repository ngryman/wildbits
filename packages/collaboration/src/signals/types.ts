import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export type Settings = {
  id: string
}

export type Provider = {
  id: string
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
