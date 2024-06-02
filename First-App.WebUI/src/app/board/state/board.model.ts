export interface Board {
  id: number,
  name: string
}

export function compareBoards(a: Board, b: Board) {
  if (a.id > b.id) {
    return 1;
  }
  if (a.id < b.id) {
    return -1;
  }
  else {
    return 0;
  }
}
