import { Provider } from '@wildbits/collaboration'

import { Theme } from '../theme'
import { Typography } from '../typography'

export type Settings = {
  provider: Provider
  theme?: Theme
  typography?: Partial<Typography>
}
