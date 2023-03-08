import { Atom, createInitializedResourceAtom } from '@wildbits/utils'
import { User } from './types'

// const COLORS = [
//   '#958DF1',
//   '#F98181',
//   '#FBBC88',
//   '#FAF594',
//   '#70CFF8',
//   '#94FADB',
//   '#B9F18D',
// ]

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

const DEFAULT_USER: User = {
  name: 'anonymous',
  color: 'black',
}

export function createUser(): Atom<User> {
  return createInitializedResourceAtom(getInitialUser, DEFAULT_USER)
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
