export enum VoteType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
  NULL = 'NULL',
}

export interface IVote {
  user: string
  comment: string
  type: VoteType
}
