declare module '*.module.css' {
  type CSSModuleClasses = { readonly [key: string]: string }
  const classes: CSSModuleClasses
  export default classes
}

interface Window {
  editor: Editor
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
