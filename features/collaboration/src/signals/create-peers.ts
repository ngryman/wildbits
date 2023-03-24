import { Accessor, createEffect, createSignal } from 'solid-js'

import { Provider, Peer } from './types'

export function createPeers(provider: Accessor<Provider>): Accessor<Peer[]> {
  const [peers, setPeers] = createSignal<Peer[]>([])

  function handleUpdate() {
    const { clientID, states } = provider().awareness

    const peers = Array.from(states.entries())
      .filter(([id]) => Number(id) !== clientID)
      .map(([id, value]) => ({ id: Number(id), user: value.user }))

    setPeers(peers)
  }

  createEffect(() => {
    provider().awareness.on('update', handleUpdate)
  })

  return peers
}
