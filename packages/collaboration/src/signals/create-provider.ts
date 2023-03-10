import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

import { Provider, Settings } from './types'

export function createProvider(settings: Settings): Provider {
  const document = new Doc()
  const webrtcProvider = new WebrtcProvider(settings.id, document, {
    signaling: ['ws://localhost:1337'],
  })

  return {
    id: settings.id,
    document,
    webrtcProvider,
  }
}
