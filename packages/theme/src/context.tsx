import { Atom, createAtom } from '@wildbits/utils'
import {
  createContext,
  createEffect,
  onCleanup,
  onMount,
  ParentProps,
  useContext,
} from 'solid-js'

import { ColorMode, Theme } from './types'
import { getFontFamilies, loadFonts, RATIO_PERFECT_FIFTH } from './typography'

const defaultColorMode: ColorMode = window.matchMedia(
  '(prefers-color-scheme: dark)'
).matches
  ? 'dark'
  : 'light'

const defaultTheme: Theme = {
  mode: defaultColorMode,
  editor: {
    typography: {
      font: {
        body: {
          name: 'Droid Serif',
          style: 'normal',
          weight: 'normal',
          tracking: 'normal',
          color: {
            light: '#2d2000',
            dark: '#e6e6e6',
          },
        },
        heading: {
          weight: 'bold',
        },
        strong: {
          weight: 'bold',
        },
        em: {
          style: 'italic',
        },
      },
      rhythm: {
        baseSize: 24,
        baseLeading: 1.6,
        scaleRatio: RATIO_PERFECT_FIFTH,
        lineLength: 60,
      },
    },
  },
}

const ThemeContext = createContext<Atom<Theme>>(createAtom(defaultTheme))

export function ThemeProvider(props: ParentProps) {
  const theme = createAtom(defaultTheme)

  onMount(() => {
    // XXX: temporary
    theme(t => ({
      ...t,
      editor: {
        typography: {
          ...t.editor.typography,
          font: {
            body: {
              ...t.editor.typography.font.body!,
              name: 'Droid Serif',
              // name: 'Cinzel Decorative',
            },
            heading: {
              name: 'Lobster',
            },
            strong: {
              name: 'Luckiest Guy',
              color: {
                light: '#000',
                dark: '#fff',
              },
            },
            em: {
              name: 'Mynerve',
            },
          },
        },
      },
    }))

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleColorModeChange)
  })

  onCleanup(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleColorModeChange)
  })

  // createEffect(() => {
  //   const fontFamilies = getFontFamilies(theme().editor.typography.font)
  //   loadFonts(fontFamilies)
  // })

  function handleColorModeChange(e: MediaQueryListEvent) {
    const mode = e.matches ? 'dark' : 'light'
    theme(t => ({ ...t, mode }))
  }

  return (
    <ThemeContext.Provider value={theme}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): Atom<Theme> {
  return useContext(ThemeContext)!
}
