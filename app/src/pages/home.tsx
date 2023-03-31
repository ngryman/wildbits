import { Navigate } from '@solidjs/router'
import { createState, getLocatorPath } from '@wildbits/model'

export default function HomePage() {
  const [state] = createState()
  const path = getLocatorPath(state.locator)

  return <Navigate href={path} />
}
