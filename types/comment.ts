export interface IComment {
  description: string
  vote?: number
  parent?: string
  user: string
  modificationDate: Date
}
