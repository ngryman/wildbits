import { Doc } from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

import { Provider } from './types'

export type ProviderOptions = {
  documentId: string
  cryptoKey: string
  signalingServer: string
}

export function createProvider(options: ProviderOptions): Provider {
  const document = new Doc()
  const webrtcProvider = new WebrtcProvider(options.documentId, document, {
    password: options.cryptoKey,
    signaling: [options.signalingServer],
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
    documentId: options.documentId,
    document,
    webrtcProvider,
  }
}
