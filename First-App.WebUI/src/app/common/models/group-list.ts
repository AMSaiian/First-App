import { GroupListInfo } from "./group-list-info";

export interface GroupList extends GroupListInfo {
  cardsAmount: number,
  hasNextCards: boolean,
  currentPage: number
}

