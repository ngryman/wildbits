import { Locator } from '@wildbits/note'
import { Accessor, createMemo } from 'solid-js'
import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'

export type Provider = WebrtcProvider

export type ProviderOptions = {
  locator: Accessor<Locator>
  doc: Accessor<Doc>
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

    const { id, key } = options.locator()
    return new WebrtcProvider(id, options.doc(), {
      password: key,
      signaling: [options.signalingServer],
      peerOpts: { config: { iceServers } },
    })
  })

  return provider
}
