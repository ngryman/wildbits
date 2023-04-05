import { Locator } from '@wildbits/model'
import { Accessor, createMemo, onCleanup } from 'solid-js'
import { WebrtcProvider } from 'y-webrtc'
import { Doc as YDoc } from 'yjs'

export type Provider = WebrtcProvider

export type ProviderOptions = {
  locator: Accessor<Locator>
  doc: Accessor<YDoc>
  signalingServer: string
}

const iceServers = [
  {
    urls: 'stun:relay.metered.ca:80',
  },
  {
    urls: 'turn:44.214.52.65',
    username: 'test',
    credential: 'test',
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

  onCleanup(() => {
    provider().destroy()
  })

  return provider
}
