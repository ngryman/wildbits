import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

import { Provider, Settings } from './types'

export function createProvider(settings: Settings): Provider {
  const document = new Doc()
  const webrtcProvider = new WebrtcProvider(settings.id, document, {
    signaling: [settings.signalingServer],
    peerOpts: {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
        ],
      },
    },
  })

  return {
    id: settings.id,
    document,
    webrtcProvider,
  }
}
