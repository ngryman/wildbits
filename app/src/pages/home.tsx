import { Navigate } from '@solidjs/router'
import { getLocatorPath, useState } from '@wildbits/model'

export default function HomePage() {
  const [state] = useState()
  const path = getLocatorPath(state.locator)

  return <Navigate href={path} />
}
