export interface GroupListInfo {
  id: number,
  name: string,
  boardId: number
}

export function compareGroupLists(a: GroupListInfo, b: GroupListInfo) {
  if (a.id > b.id) {
    return 1;
  }
  else if (a.id < b.id) {
    return -1;
  }
  else {
    return 0;
  }
}
