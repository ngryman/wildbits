import { Component, ParentProps } from 'solid-js'
import { styled } from 'solid-styled-components'

export type WorkspaceProps = ParentProps & {
  isSplit: boolean
}

export const Workspace: Component<WorkspaceProps> = styled.main`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: ${props => `1fr ${props.isSplit ? 1 : 0}fr`};
  height: 100vh;
  transition: all 300ms ease-in-out;
`
