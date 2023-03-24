interface Window {
  editor: Editor
}

declare module '*.module.css' {
  type CSSModuleClasses = { readonly [key: string]: string }
  const classes: CSSModuleClasses
  export default classes
}
