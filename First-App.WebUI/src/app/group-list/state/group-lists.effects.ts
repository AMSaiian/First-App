﻿import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { GroupListService } from "../services/group-list-service";
import { ErrorsService } from "../../common/services/errors-service";
import { GroupListsActions } from "./group-lists.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { Update } from "@ngrx/entity";
import { GroupList } from "./group-list.model";
import { Store } from "@ngrx/store";
import { GroupListsFeature } from "./group-lists.state";
import { BoardsActions } from "../../board/state/boards.actions";
import { CardsActions } from "../../card/state/cards.actions";
import { CardsFeature } from "../../card/state/cards.state";

@Injectable({ providedIn: "root" })
export class GroupListsEffects {

  constructor(private readonly store: Store,
              private readonly actions$: Actions,
              private readonly groupListService: GroupListService,
              private readonly errorService: ErrorsService
  ) {}

  public readonly apiAddList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.apiAddList),
      exhaustMap(props => this.groupListService.createList(props.groupList)
        .pipe(
          map(data => GroupListsActions.addList({
            groupList: {
              ...props.groupList,
              id: data
            } as GroupList
          })),
          catchError(error => EMPTY)
        )
      )
    )
  )

  public readonly apiUpdateList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.apiUpdateList),
      exhaustMap(props => this.groupListService.updateList(props.id, props.changes)
        .pipe(
          map(() => GroupListsActions.updateList({
            groupListChanges: {
              id: props.id,
              changes: props.changes
            }
          })),
          catchError(error => EMPTY)
        )
      )
    )
  )

  public readonly apiDeleteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.apiDeleteList),
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

  public readonly apiGetListCards$ = createEffect(() =>
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

  public readonly deleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.deleteBoard),
      concatLatestFrom(action =>
        this.store.select(GroupListsFeature.selectGroupListsByBoardId(action.boardId))
      ),
      map(([, groupLists]) =>
        GroupListsActions.deleteLists({ listIds: groupLists.map(groupList => groupList.id) })
      )
    )
  );

  public readonly addCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.addCard),
      map(props => GroupListsActions.incrementCardAmount({ listId: props.card.groupId }))
    )
  );

  public readonly beforeDeleteCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.beforeDeleteCard),
      concatLatestFrom(action =>
        this.store.select(CardsFeature.selectCardById(action.cardId))
      ),
      map(([, card]) => GroupListsActions.decrementCardAmount({ listId: card.groupId }))
    )
  );

  public readonly beforeUpdateCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.beforeUpdateCard),
      concatLatestFrom(action =>
        this.store.select(CardsFeature.selectCardById(action.card.id as number))
      ),
      map(([action, currentCard]) => {
        const previousGroupId = currentCard.groupId;
        const newGroupId = action.card.changes.groupId;

        if (newGroupId != null
        && newGroupId !== previousGroupId) {
          return GroupListsActions.exchangeCardAmount({ donorId: previousGroupId, recipientId: newGroupId });
        } else {
          return EMPTY;
        }
      })
    ), { dispatch: false }
  )
}
