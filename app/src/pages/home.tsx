import { Navigate } from '@solidjs/router'
import { generateKey } from '@wildbits/utils'
import { nanoid } from 'nanoid'
import { createResource, Resource, Show } from 'solid-js'

export default function HomePage() {
  const path = createPath()

  return (
    <Show when={path()}>
      <Navigate href={path()!} />
    </Show>
  )
}

function createPath(): Resource<string> {
  return createResource(generatePath)[0]
}

async function generatePath(): Promise<string> {
  const id = nanoid()
  const key = await generateKey()
  const path = `/${id}#${key}`
  return path
}
