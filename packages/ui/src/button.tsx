import { ParentProps } from 'solid-js'

import styles from './button.module.css'

type Size = 'small' | 'normal' | 'large'

type Type = 'primary' | 'normal'

type Props = ParentProps & {
  active?: boolean
  size?: Size
  type?: Type
  disabled?: boolean
  onClick?(e: MouseEvent): void
}

export function Button(props: Props) {
  return (
    <button
      class={styles.root}
      classList={{
        [styles.active]: props.active,
        [styles['size-' + (props.size || 'normal')]]: true,
        [styles['type-' + (props.type || 'normal')]]: true,
      }}
      disabled={props.disabled}
      onClick={e => props.onClick?.(e)}
    >
      {props.children}
    </button>
  )
}
