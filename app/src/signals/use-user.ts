import { createResource, Resource } from 'solid-js'

export type User = {
  name: string
  color: string
}

const COLORS = [
  '#958DF1',
  '#F98181',
  '#FBBC88',
  '#FAF594',
  '#70CFF8',
  '#94FADB',
  '#B9F18D',
]

export function useUser(): Resource<User> {
  const [user] = createResource(getInitialUser)
  return user
}

async function getInitialUser(): Promise<User> {
  return (
    JSON.parse(window.localStorage.getItem('user')!) || {
      name: await getRandomName(),
      color: getRandomColor(),
    }
  )
}

async function getRandomName(): Promise<string> {
  const { nickname } = await (
    await window.fetch('https://nicknames.ngryman.workers.dev/')
  ).json()
  return nickname
}

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}
