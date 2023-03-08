import { Provider } from '@wildbits/collaboration'

import { Theme } from '../theme'
import { Typography } from '../typography'

export type Settings = {
  element: HTMLElement
  provider: Provider
  theme?: Theme
  typography?: Partial<Typography>
}
