import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { GroupListService } from "../services/group-list-service";
import { ErrorsService } from "../../common/services/errors-service";
import { GroupListsActions } from "./group-lists.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { Update } from "@ngrx/entity";
import { GroupList } from "./group-list.model";
import { Store } from "@ngrx/store";
import { GroupListsFeature, GroupListsState } from "./group-lists.state";
import { BoardsActions } from "../../board/state/boards.actions";
import { UpdateNum } from "@ngrx/entity/src/models";

@Injectable({ providedIn: "root" })
export class GroupListsEffects {

  constructor(private readonly groupListsStore: Store<GroupListsState>,
              private readonly actions$: Actions,
              private readonly groupListService: GroupListService,
              private readonly errorService: ErrorsService
  ) {}

  public readonly addGroupList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.addList),
      exhaustMap(props => this.groupListService.createList(props.groupList)
        .pipe(
          map(data => GroupListsActions.addList({ groupList: { ...props.groupList, id: data } })),
          catchError(error => EMPTY)
        )
      )
    )
  )

  public readonly updateGroupList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.updateList),
      exhaustMap(props => this.groupListService.updateList({
        ...props.groupListChanges.changes,
        id: (props.groupListChanges as UpdateNum<GroupList>).id
      })
        .pipe(
          map(() => GroupListsActions.updateList({ groupListChanges: props.groupListChanges })),
          catchError(error => EMPTY)
        )
      )
    )
  )

  public readonly beforeDeleteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.beforeDeleteList),
      exhaustMap(props => this.groupListService.deleteList(props.listId)
        .pipe(
          map(() => GroupListsActions.deleteList({ listId: props.listId })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly postApiGetBoardWithLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postApiGetBoardWithLists),
      map((data) => GroupListsActions.addLists({ groupLists: data.groupLists }))
    )
  );

  public readonly apiGetNextListCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.apiGetListCards),
      exhaustMap(props => this.groupListService.getGroupListCards(props.listId, props.paginationContext)
        .pipe(
          map(cards => GroupListsActions.postApiGetListCards({ listId: props.listId, paginatedCards: cards })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly postApiGetListCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.postApiGetListCards),
      map(props => GroupListsActions.updateList({
        groupListChanges: {
          id: props.listId,
          changes: {
            currentPage: props.paginatedCards.pagedInfo.pageNumber,
            cardsAmount: props.paginatedCards.pagedInfo.totalRecords,
            hasNextCards: props.paginatedCards.pagedInfo.totalPages > props.paginatedCards.pagedInfo.pageNumber
          }
        } as Update<GroupList>
      }))
    )
  );

  public readonly postDeleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postDeleteBoard),
      concatLatestFrom(action =>
        this.groupListsStore.select(GroupListsFeature.selectGroupListsByBoardId(action.boardId))
      ),
      map(([, groupLists]) =>
        GroupListsActions.beforeDeleteLists({ listIds: groupLists.map(groupList => groupList!.id) })
      )
    )
  );

  public readonly beforeDeleteLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.beforeDeleteLists),
      map(props => GroupListsActions.deleteLists({ listIds: props.listIds }))
    )
  );
}
