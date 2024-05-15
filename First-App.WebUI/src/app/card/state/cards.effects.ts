import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CardsActions } from "./cards.actions";
import { concatLatestFrom } from "@ngrx/operators";
import { CardsFeature, CardsState } from "./cards.state";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { GroupListsActions } from "../../group-list/state/group-lists.actions";
import { Store } from "@ngrx/store";
import { ErrorsService } from "../../common/services/errors-service";
import { CardService } from "../services/card-service";
import { Card } from "./card.model";
import { BoardsActions } from "../../board/state/boards.actions";

@Injectable({ providedIn: "root" })
export class CardsEffects {

  constructor(private readonly actions$: Actions,
              private readonly cardService: CardService,
              private readonly cardsStore: Store<CardsState>,
              private readonly errorsService: ErrorsService
  ) {}

  public readonly beforeAddCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.beforeAddCard),
      exhaustMap(props => this.cardService.createCard(props.card)
        .pipe(
          map(data => CardsActions.postAddCard({ card: { ...props.card, id: data } as Card })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly postApiGetBoardsWithLists = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postApiGetBoardWithLists),
      map(props => CardsActions.addCards({ cards: props.cards }))
    )
  );

  public readonly postAddCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.postAddCard),
      map(props => CardsActions.addCard({ card: props.card }))
    )
  );

  public readonly postAddCard2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.postAddCard),
      map(props => GroupListsActions.incrementCardAmount({ listId: props.card.groupId }))
    )
  );

  public readonly postDeleteCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.postDeleteCard),
      concatLatestFrom(action =>
        this.cardsStore.select(CardsFeature.selectCardById(action.cardId))
      ),
      map(([, card]) => GroupListsActions.decrementCardAmount({ listId: card.groupId }))
    )
  )

  public readonly postDeleteCard2$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CardsActions.postDeleteCard),
      map(props => CardsActions.deleteCard({ cardId: props.cardId }))
    )
  )
}
