import styles from './cursor.module.css'

type Props = {
  name: string
  color: string
}

export function Cursor(props: Props) {
  return (
    <span
      class={styles.root}
      contentEditable={false}
      style={{
        ['--color']: props.color,
      }}
    >
      <div class={styles.name}>{props.name}</div>
    </span>
  )
}
