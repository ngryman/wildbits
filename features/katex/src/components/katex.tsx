import { BubbleMenu } from '@wildbits/ui'
import { NodeViewProps } from '@wildbits/utils'
import { createMemo, Show } from 'solid-js'
import katex from 'katex'

import { KatexAttributes } from '..'
import { EquationForm } from './equation-form'

import styles from './katex.module.css'

export function Katex(props: NodeViewProps<KatexAttributes>) {
  let ref!: HTMLSpanElement

  const equation = () => props.attrs.equation
  const selected = () => props.selected

  const output = createMemo(() => {
    try {
      return katex.renderToString(equation().trim(), { output: 'mathml' })
    } catch (e) {
      return equation()
    }
  })

  const updateEquation = (equation: string) => {
    props.setAttributes({ equation })
  }

  return (
    <span class={styles.root}>
      <span ref={ref} innerHTML={output()} />
      <Show when={selected()}>
        <BubbleMenu>
          <EquationForm initialEquation={equation()} onChange={updateEquation} />
        </BubbleMenu>
      </Show>
    </span>
  )
}
