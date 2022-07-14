export interface EditorFormInputProps<T = any> {
  name: string
  defaultValue: T
  readOnly?: boolean
  required?: boolean
  placeholder?: string
  options?: T[]
  className?: string
}
