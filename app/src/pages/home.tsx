import { Navigate } from '@solidjs/router'
import { nanoid } from 'nanoid'

export default function HomePage() {
  const id = generateDocId()
  const path = `/${id}`
  return <Navigate href={path} />
}

function generateDocId(): string {
  return nanoid()
}
