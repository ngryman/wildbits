import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

import { Provider, Settings } from './types'

export function createProvider(settings: Settings): Provider {
  const document = new Doc()
  const webrtcProvider = new WebrtcProvider(settings.documentId, document, {
    password: settings.cryptoKey,
    signaling: [settings.signalingServer],
    peerOpts: {
      config: {
        iceServers: [
          {
            urls: 'stun:relay.metered.ca:80',
          },
          {
            urls: 'turn:relay.metered.ca:80',
            username: 'fc383dd5cae9548765b98b89',
            credential: 'FtPmYMMuKpRuAtvE',
          },
          {
            urls: 'turn:relay.metered.ca:443',
            username: 'fc383dd5cae9548765b98b89',
            credential: 'FtPmYMMuKpRuAtvE',
          },
          {
            urls: 'turn:relay.metered.ca:443?transport=tcp',
            username: 'fc383dd5cae9548765b98b89',
            credential: 'FtPmYMMuKpRuAtvE',
          },
        ],
      },
    },
  })

  return {
    documentId: settings.documentId,
    document,
    webrtcProvider,
  }
}
