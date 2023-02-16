import { createGlobalStyles } from 'solid-styled-components'

export default createGlobalStyles`
  html {
    box-sizing: border-box;
    font-size: 28px;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    outline: 0;
  }

  body {
    margin: 0;
    font-family: Inconsolata, sans-serif;
    line-height: 1.5;
    background: #f5f5f5;
    color: #323f46;
  }


  ::selection {
    /* color: #636140; */
    /* background: #fff9ae; */
    background: #cadbf8;
  }
`
