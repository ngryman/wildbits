import { Accessor, For } from 'solid-js'

import { Peer } from '..'

import styles from './peers.module.css'

type Props = {
  peers: Accessor<Peer[]>
}

export function Peers(props: Props) {
  return (
    <ul class={styles.root}>
      <For each={props.peers()}>
        {peer => (
          <li style={{ ['--color']: peer.user.color }} class={styles.peer}>
            {peer.user.name}
          </li>
        )}
      </For>
    </ul>
  )
}
