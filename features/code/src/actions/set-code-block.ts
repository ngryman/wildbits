import { ActionsProps } from '@wildbits/utils'

import { CodeBlockAttributes } from '../extension'

export function setCodeBlock({ params, chain }: ActionsProps<CodeBlockAttributes>): boolean {
  return chain().setNode('codeBlock', params).scrollIntoView().run()
}
