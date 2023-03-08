import { Component, ParentProps } from 'solid-js'
import { styled } from 'solid-styled-components'

type Props = ParentProps & {
  isSplit: boolean
}

export const Workspace: Component<Props> = styled.main`
  display: grid;
  overflow-x: hidden;
  grid-auto-flow: column;
  grid-template-columns: ${props => `1fr ${props.isSplit ? 1 : 0}fr`};
  height: 100vh;
  transition: all 300ms ease-in-out;
`
