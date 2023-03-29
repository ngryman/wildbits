import { createAtom } from '@wildbits/utils'
import { onMount } from 'solid-js'

import styles from './equation-form.module.css'

type Props = {
  initialEquation: string
  onChange(equation: string): void
}

type State = {
  equation: string
}

export function EquationForm(props: Props) {
  let inputElement!: HTMLInputElement

  const state = createAtom<State>({ equation: props.initialEquation })

  const handleInput = (e: InputEvent) => {
    state({ equation: (e.target as HTMLInputElement).value })
  }

  const handleSubmit = () => {
    props.onChange(state().equation)
  }

  onMount(() => {
    inputElement.select()
  })

  return (
    <form class={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputElement}
        class={styles.input}
        style={{ width: `${state().equation.length}ch` }}
        value={state().equation}
        draggable={false}
        onInput={handleInput}
      />
      <input type="submit" hidden />
    </form>
  )
}
