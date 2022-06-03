export const __IS_DEV__ = process.env.NODE_ENV === "development"
export const __IS_SERVER__ = !(typeof document !== "undefined")

// CSS
export const CSS_VAR_HEADER_HEIGHT = "--header-height"
