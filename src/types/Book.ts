export interface Book {
  id: string,
  title: string,
  author: string,
  category: string,
  ISBN?: number | null,
  created?: any,
  edited?: any,
  active?: boolean,
}
