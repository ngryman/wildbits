import { Accessor, createResource } from 'solid-js'

export type User = {
  name: string
  color: string
}

const COLORS = [
  '#EC1D43',
  '#EC811D',
  '#ECBE1D',
  '#B6EC1D',
  '#1DA2EC',
  '#781DEC',
  '#CF1DEC',
  '#222222',
]

const defaultUser: User = {
  name: `anonymous${Math.random().toString().slice(2, 6)}`,
  color: getRandomColor(),
}

export function createUser(): Accessor<User> {
  const [user] = createResource<User>(getInitialUser, {
    initialValue: defaultUser,
  })
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
  try {
    const { nickname } = await (await window.fetch('https://nicknames.ngryman.workers.dev/')).json()
    return nickname
  } catch {
    // If for some reason the endpoint fails, return the `DEFAULT_USER` name.
    // This is not a critical endpoint.
    return defaultUser.name
  }
}

function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}
