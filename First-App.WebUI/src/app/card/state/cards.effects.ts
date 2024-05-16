import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CardsActions } from "./cards.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { ErrorsService } from "../../common/services/errors-service";
import { CardService } from "../services/card-service";
import { Card } from "./card.model";
import { BoardsActions } from "../../board/state/boards.actions";
import { GroupListsActions } from "../../group-list/state/group-lists.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { Store } from "@ngrx/store";
import { CardsFeature } from "./cards.state";

@Injectable({ providedIn: "root" })
export class CardsEffects {

  constructor(private readonly actions$: Actions,
              private readonly cardService: CardService,
              private readonly store: Store,
              private readonly errorsService: ErrorsService
  ) {}

  public readonly apiAddCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.apiAddCard),
      exhaustMap(props => this.cardService.createCard(props.card)
        .pipe(
          map(data => CardsActions.addCard({ card: { ...props.card, id: data } as Card })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly apiUpdateCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.apiUpdateCard),
      exhaustMap(props => this.cardService.updateCard(props.id, props.changes)
        .pipe(
          map(() => CardsActions.beforeUpdateCard({
            card: {
              id: props.id,
              changes: props.changes
            }
          }))
        )
      )
    )
  )

  public readonly apiDeleteCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.apiDeleteCard),
      exhaustMap(props => this.cardService.deleteCard(props.cardId)
        .pipe(
          map(() => CardsActions.beforeDeleteCard({ cardId: props.cardId })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly beforeUpdateCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.beforeUpdateCard),
      map(props => CardsActions.updateCard({ card: props.card }))
    )
  );

  public readonly beforeDeleteCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.beforeDeleteCard),
      map(props => CardsActions.deleteCard({ cardId: props.cardId }))
    )
  );

  public readonly postApiGetBoardsWithLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postApiGetBoardWithLists),
      map(props => CardsActions.addCards({ cards: props.cards }))
    )
  );

  public readonly deleteLists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.deleteLists),
      concatLatestFrom(action =>
        this.store.select(CardsFeature.selectCardsByListIds(action.listIds))
      ),
      map(([, cards]) => CardsActions.deleteCards({ cardIds: cards.map(card => card.id) }))
    )
  );

  public readonly deleteList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GroupListsActions.deleteList),
      concatLatestFrom(action =>
        this.store.select(CardsFeature.selectCardsByListId(action.listId))
      ),
      map(([, cards]) => CardsActions.deleteCards({ cardIds: cards.map(card => card.id) }))
    )
  )
}
