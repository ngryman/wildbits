import { ActionsProps } from '@wildbits/utils'

import { CodeBlockAttributes } from '../extension'

export function toggleCodeBlock({ params, chain }: ActionsProps<CodeBlockAttributes>): boolean {
  return chain().toggleNode('codeBlock', 'paragraph', params).scrollIntoView().run()
}
