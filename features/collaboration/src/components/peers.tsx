import { Accessor, For, Show } from 'solid-js'

import { getUserInitials, Peer } from '..'

import styles from './peers.module.css'

type Props = {
  peers: Accessor<Peer[]>
}

export function Peers(props: Props) {
  return (
    <Show when={props.peers().length}>
      <ul class={styles.root}>
        <For each={props.peers()}>
          {peer => (
            <li
              style={{ ['--color']: peer.user.color }}
              class={styles.peer}
              data-name={peer.user.name}
            >
              {getUserInitials(peer.user)}
            </li>
          )}
        </For>
      </ul>
    </Show>
  )
}
