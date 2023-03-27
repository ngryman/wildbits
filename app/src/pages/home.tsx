import { Navigate } from '@solidjs/router'
import { Locator } from '@wildbits/note'
import { createResource, Resource, Show } from 'solid-js'

export default function HomePage() {
  const locator = createLocator()

  return (
    <Show when={locator()}>
      <Navigate href={locator()!.path} />
    </Show>
  )
}

function createLocator(): Resource<Locator> {
  return createResource(Locator.generate)[0]
}
