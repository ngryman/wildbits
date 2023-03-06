import { Navigate } from '@solidjs/router'
import { ulid } from 'ulid'

export default function HomePage() {
  const id = generateDocId()
  const path = `/${id}`
  return <Navigate href={path} />
}

function generateDocId(): string {
  return ulid().toLowerCase()
}
