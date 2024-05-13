import { createActionGroup, props } from "@ngrx/store";
import { GroupList } from "./group-list.model";
import { Update } from "@ngrx/entity";

export const GroupListsActions = createActionGroup({
  source: "GroupLists",
  events : {
    addLists: props<{ groupLists: GroupList[] }>(),
    addList: props<{ groupList: GroupList }>(),
    updateList: props<{ groupListChanges: Update<GroupList> }>(),
    beforeDeleteList: props<{ listId: number }>(),
    deleteList: props<{ listId: number }>(),
    apiGetNextListCards: props<{ listId: number }>()
  }
});
