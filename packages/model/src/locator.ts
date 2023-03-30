import { generateKey } from '@wildbits/utils'
import { nanoid } from 'nanoid'
import { Resource, createEffect, createResource, Setter } from 'solid-js'

export class Locator {
  constructor(readonly id: string, readonly key: string) {}

  get path(): string {
    return `/${this.id}#${this.key}`
  }

  toJSON(): string {
    return JSON.stringify({ id: this.id, key: this.key })
  }

  static async generate(): Promise<Locator> {
    return new Locator(nanoid(), await generateKey())
  }

  static fromJSON(json: string): Locator | undefined {
    const obj = JSON.parse(json)
    // @ts-ignore
    return obj ? Object.assign(new Locator(), obj) : undefined
  }
}

export function useLastLocator(): [Resource<Locator>, Setter<Locator>] {
  const [lastLocator, { mutate: setLastLocator }] = createResource(getLastLocator)

  createEffect(() => {
    if (lastLocator()) {
      localStorage.setItem('last-locator', lastLocator()!.toJSON())
    }
  })

  return [lastLocator, setLastLocator]
}

async function getLastLocator(): Promise<Locator> {
  try {
    return Locator.fromJSON(localStorage.getItem('last-locator')!) || (await Locator.generate())
  } catch (e) {
    return await Locator.generate()
  }
}
