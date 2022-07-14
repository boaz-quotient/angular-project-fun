
export const ActionTypes = {
  TYPING: 'TYPING',
  LOADMORE: 'LOADMORE',
} as const

export type Action =
  { action: typeof ActionTypes.TYPING, url: string, term: string } |
  { action: typeof ActionTypes.LOADMORE, url: string, term: string, next: string }

export type Character = {
  gender: string,
  id: number,
  image: string,
  name: string,
  species: string,
  status: string,
  origin: { name: string },
  location: { name: string },
}
