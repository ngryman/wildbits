import { createGlobalStyles } from 'solid-styled-components'

export const GlobalStyles = createGlobalStyles`
  html {
    box-sizing: border-box;
    font-size: 26px;
    background: #fafaf6;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    outline: 0;
  }

  body {
    margin: 0;
    font-family: "Ubuntu Mono", sans-serif;
    line-height: 1.6;
    color: #323f46;
  }

  h1 {
    color: #4a3500;
  }

  p  {
    color: #563d00;
  }

  ::selection {
    background: #f6e7c9;
  }
`
