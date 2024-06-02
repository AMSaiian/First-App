import { GroupListWithCardsDto } from "./group-list-with-cards-dto";

export interface BoardWithGroupListsDto {
  id: number,
  name: string,
  groupLists: GroupListWithCardsDto[]
}
