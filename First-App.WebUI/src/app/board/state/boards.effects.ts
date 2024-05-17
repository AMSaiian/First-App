import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BoardService } from "../services/board-service";
import { ErrorsService } from "../../common/services/errors-service";
import { BoardsActions } from "./boards.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { ErrorsActions } from "../../common/actions/errors.actions";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class BoardsEffects {

  constructor(private readonly actions$: Actions,
              private readonly boardService: BoardService,
              private readonly router: Router,
              private readonly errorsService: ErrorsService
  ) {}

  public readonly apiAddBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.apiAddBoard),
      exhaustMap((props) => this.boardService.createBoard(props.board)
        .pipe(
          map(data => BoardsActions.addBoard({ board: { id: data, name: props.board.name! } })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly apiUpdateBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.apiUpdateBoard),
      exhaustMap(props => this.boardService.updateBoard(props.id, props.changes)
        .pipe(
          map(() => BoardsActions.updateBoard({
            boardChanges: {
              id: props.id,
              changes: props.changes
            }
          })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly apiGetBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.apiGetBoards),
      exhaustMap(() => this.boardService.getBoards()
        .pipe(
          map(boards => BoardsActions.addBoards({ boards: boards })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly apiGetBoardWithCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.apiGetBoardWithLists),
      exhaustMap(props => this.boardService.getBoardWithLists(props.boardId, props.paginationContext)
        .pipe(
          map(([board, groupLists, cards]) =>
              BoardsActions.postApiGetBoardWithLists({ board: board, groupLists: groupLists, cards: cards })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly postApiGetBoardWithCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postApiGetBoardWithLists),
      map(props => BoardsActions.addBoard({ board: props.board }))
    )
  );

  public readonly apiDeleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.apiDeleteBoard),
      exhaustMap(props => this.boardService.deleteBoard(props.boardId)
        .pipe(
          map(() => BoardsActions.deleteBoard({ boardId: props.boardId })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly deleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.deleteBoard),
      map(() => this.router.navigate(['/']))
    ), { dispatch: false }
  );
}
