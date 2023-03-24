import { Note } from '@wildbits/core'
import { Accessor, createMemo } from 'solid-js'
import { WebrtcProvider } from 'y-webrtc'

import { Provider } from './types'

export type ProviderOptions = {
  note: Accessor<Note>
  signalingServer: string
}

const iceServers = [
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
]

export function createProvider(options: ProviderOptions): Accessor<Provider> {
  const provider = createMemo<Provider>(provider => {
    if (provider) {
      provider.destroy()
    }

    const { id, key, doc } = options.note()
    console.log('collab', doc.guid)
    return new WebrtcProvider(id, doc, {
      password: key,
      signaling: [options.signalingServer],
      peerOpts: { config: { iceServers } },
    })
  })

  return provider
}
