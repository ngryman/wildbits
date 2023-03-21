interface Window {
  editor: Editor
}

interface ImportMetaEnv {
  readonly DEV: number
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.module.css' {
  type CSSModuleClasses = { readonly [key: string]: string }
  const classes: CSSModuleClasses
  export default classes
}
