import { GroupList } from "./group-list.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeature, createReducer, on } from "@ngrx/store";
import { GroupListsActions } from "./group-lists.actions";

export interface State extends EntityState<GroupList> {
}

const adapter = createEntityAdapter<GroupList>();
const initialState = adapter.getInitialState();

export const GroupListsFeature = createFeature({
  name: "groupLists",
  reducer: createReducer(
    initialState,
    on(GroupListsActions.addLists, (state, { groupLists }) => adapter.addMany(groupLists, state)),
    on(GroupListsActions.addList, (state, { groupList }) => adapter.addOne(groupList, state)),
    on(GroupListsActions.updateList, (state, { groupListChanges }) => adapter.updateOne(groupListChanges, state)),
    on(GroupListsActions.deleteList, (state, { listId }) => adapter.removeOne(listId, state))
  )
})
