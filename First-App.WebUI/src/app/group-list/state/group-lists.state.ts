import { GroupList } from "./group-list.model";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { GroupListsActions } from "./group-lists.actions";
import { compareGroupLists, GroupListInfo } from "./group-list-info";

export interface GroupListsState extends EntityState<GroupList> {
}

const adapter = createEntityAdapter<GroupList>({
  sortComparer: compareGroupLists
});
const initialState = adapter.getInitialState();

export const GroupListsFeature = createFeature({
  name: "groupLists",
  reducer: createReducer(
    initialState,

    on(GroupListsActions.addLists, (state, { groupLists }) =>
      adapter.addMany(groupLists, state)
    ),

    on(GroupListsActions.addList, (state, { groupList }) =>
      adapter.addOne(groupList, state)
    ),

    on(GroupListsActions.updateList, (state, { groupListChanges }) =>
      adapter.updateOne(groupListChanges, state)
    ),

    on(GroupListsActions.deleteList, (state, { listId }) =>
      adapter.removeOne(listId, state)
    ),

    on(GroupListsActions.deleteLists, (state, { listIds }) =>
      adapter.removeMany(listIds, state)
    ),

    on(GroupListsActions.incrementCardAmount, (state, { listId }) =>
      adapter.map(list => {
        if (list.id === listId) {
          return { ...list, cardsAmount: list.cardsAmount + 1 };
        } else {
          return list;
        }
      }, state)
    ),

    on(GroupListsActions.decrementCardAmount, (state, { listId }) =>
      adapter.map(list => {
        if (list.id === listId) {
          return { ...list, cardsAmount: list.cardsAmount - 1 };
        } else {
          return list;
        }
      }, state)
    ),

    on(GroupListsActions.exchangeCardAmount, (state, { donorId, recipientId }) =>
      adapter.map(list => {
        if (list.id === donorId) {
          return { ...list, cardsAmount: list.cardsAmount - 1 };
        } else if (list.id === recipientId) {
          return { ...list, cardsAmount: list.cardsAmount + 1 };
        } else {
          return list;
        }
      }, state)
    )
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectGroupListsState),
    selectGroupListById: (id: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => entities[id]
    ),
    selectGroupListsByBoardId: (boardId: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => (Object
        .values(entities)
        .filter(groupList => groupList?.boardId === boardId) as GroupList[])
        .sort(compareGroupLists)
    ),
    selectAnotherGroupLists: (listId: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => {
        const ignoreGroupList = entities[listId];
        return (Object
          .values(entities)
          .filter(groupList =>
            groupList?.id !== listId
            && groupList?.boardId === ignoreGroupList?.boardId
          ) as GroupListInfo[])
          .sort(compareGroupLists)
      }
    )
  })
})
