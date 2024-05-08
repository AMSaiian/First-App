export interface Card {
  id: number,
  name: string,
  description: string,
  dueDate: Date,
  priorityId: number,
  groupId: number
}

export function compareCards(a: Card, b: Card) {
  if (a.dueDate > b.dueDate) {
    return 1;
  }
  else if (a.dueDate < b.dueDate) {
    return -1;
  }
  else if (a.id > b.id) {
    return 1;
  }
  else if (a.id < b.id) {
    return -1;
  }
  else {
    return 0;
  }
}
