import { WebrtcProvider } from 'y-webrtc'

export type Provider = WebrtcProvider

export type User = {
  name: string
  color: string
}

export type Peer = {
  id: number
  user: User
}
