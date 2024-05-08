import {GroupList} from "./group-list";

export interface GroupListInfo {
  id: number,
  name: string
}

export function compareGroupLists(a: GroupList, b: GroupList) {
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
