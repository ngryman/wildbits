import { Typography } from './typography'

export type ColorMode = 'dark' | 'light'

export type Color = {
  light: string
  dark: string
}

export type Theme = {
  mode: ColorMode
  editor: EditorTheme
}

export type EditorTheme = {
  typography: Typography
}
