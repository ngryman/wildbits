import { Accessor, createEffect, createSignal } from 'solid-js'

import { Provider, User } from '.'

export type Peer = {
  id: number
  user: User
}

export type PeerOptions = {
  provider: Accessor<Provider>
}

export function createPeers(options: PeerOptions): Accessor<Peer[]> {
  const [peers, setPeers] = createSignal<Peer[]>([])

  function handleUpdate() {
    const { provider } = options
    const { clientID, states } = provider().awareness

    const peers = Array.from(states.entries())
      .filter(([id]) => Number(id) !== clientID)
      .map(([id, value]) => ({ id: Number(id), user: value.user }))

    setPeers(peers)
  }

  createEffect(() => {
    const { provider } = options
    provider().awareness.on('update', handleUpdate)
  })

  return peers
}
