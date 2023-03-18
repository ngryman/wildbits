import { Accessor, createEffect, createSignal } from 'solid-js'

import { Provider, Peer } from './types'

export function createPeers(provider: Provider): Accessor<Peer[]> {
  const [peers, setPeers] = createSignal<Peer[]>([])

  createEffect(() => {
    provider.webrtcProvider.awareness.on('update', () => {
      const { clientID, states } = provider.webrtcProvider.awareness
      const peers = Array.from(states.entries())
        .filter(([id]) => Number(id) !== clientID)
        .map(([id, value]) => ({ id: Number(id), user: value.user }))
      setPeers(peers)
    })
  })

  return peers
}
