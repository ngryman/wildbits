import { Navigate } from '@solidjs/router'
import { useLastLocator } from '@wildbits/note'
import { Show } from 'solid-js'

export default function HomePage() {
  const [lastLocator] = useLastLocator()

  return (
    <Show when={lastLocator()}>
      <Navigate href={lastLocator()!.path} />
    </Show>
  )
}
