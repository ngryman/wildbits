import { Attrs } from '@tiptap/pm/model'
import { For, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

import { ActionField } from '../extension'

import styles from './action-form.module.css'

type Props = {
  fields: ActionField[]
  initialAttrs: Attrs
  onChange(attrs: Attrs): void
}

export function ActionForm(props: Props) {
  let firstElement!: HTMLInputElement
  const [state, setState] = createStore(props.initialAttrs)

  const handleInput = (key: string, e: InputEvent) => {
    setState(key, (e.target as HTMLInputElement).value)
  }

  const handleSubmit = () => {
    props.onChange(state)
  }

  onMount(() => {
    firstElement.select()
  })

  return (
    <form class={styles.form} onSubmit={handleSubmit}>
      <For each={props.fields}>
        {(field, i) => (
          <input
            ref={el => (i() === 0 ? (firstElement = el) : undefined)}
            class={styles.input}
            placeholder={field.name}
            value={state[field.key] || ''}
            onInput={[handleInput, field.key]}
          />
        )}
      </For>
      <input type="submit" hidden />
    </form>
  )
}
