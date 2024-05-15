import { createActionGroup, props } from "@ngrx/store";
import { GroupList } from "./group-list.model";
import { Update } from "@ngrx/entity";
import { Paginated } from "../../common/dtos/pagination/paginated";
import { Card } from "../../card/state/card.model";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";

export const GroupListsActions = createActionGroup({
  source: "GroupLists",
  events : {
    addLists: props<{ groupLists: GroupList[] }>(),
    addList: props<{ groupList: Partial<GroupList> }>(),

    updateList: props<{ groupListChanges: Update<GroupList> }>(),

    beforeDeleteList: props<{ listId: number }>(),
    deleteList: props<{ listId: number }>(),

    beforeDeleteLists: props<{ listIds: number[] }>(),
    deleteLists: props<{ listIds: number[] }>(),

    apiGetListCards: props<{ listId: number, paginationContext: PaginationContext }>(),
    postApiGetListCards: props<{ listId: number, paginatedCards: Paginated<Card> }>(),

    exchangeCardAmount: props<{ donorId: number, recipientId: number }>(),
    incrementCardAmount: props<{ listId: number }>(),
    decrementCardAmount: props<{ listId: number }>()
  }
});
