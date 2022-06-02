declare namespace Intl {
  class ListFormat {
    constructor(locales?: string | string[], options?: Intl.ListFormatOptions)
    public format: (items: string[]) => string
    public formatToParts: (items: string[]) => Array<{
      type: "literal" | "element"
      value: string
    }>
  }

  interface ListFormatOptions {
    type?: "conjunction" | "disjunction" | "unit"
    style?: "long" | "short" | "narrow"
  }
}
