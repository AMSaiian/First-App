import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { BoardService } from "../services/board-service";
import { ErrorsService } from "../../common/services/errors-service";
import { BoardsActions } from "./boards.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";
import { UpdateNum } from "@ngrx/entity/src/models";
import { Board } from "./board.model";

@Injectable({ providedIn: "root" })
export class BoardsEffects {

  constructor(private readonly actions$: Actions,
              private readonly boardService: BoardService,
              private readonly errorService: ErrorsService
  ) {}

  public readonly createBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.createBoard),
      exhaustMap((props) => this.boardService.createBoard(props.board)
        .pipe(
          map(data => BoardsActions.addBoard({ board: { id: data, name: props.board.name! } })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly updateBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.updateBoard),
      exhaustMap((props) => this.boardService.updateBoard({
        ...props.boardChanges.changes,
        id: (props.boardChanges as UpdateNum<Board>).id
      })
        .pipe(
          map(() => BoardsActions.updateBoard({ boardChanges: props.boardChanges })),
          catchError(error => EMPTY)
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
          catchError(error => EMPTY)
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
          catchError(error => EMPTY)
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

  public readonly beforeDeleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.beforeDeleteBoard),
      exhaustMap(props => this.boardService.deleteBoard(props.boardId)
        .pipe(
          map(() => BoardsActions.postDeleteBoard({ boardId: props.boardId })),
          catchError(error => EMPTY)
        )
      )
    )
  );

  public readonly postDeleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardsActions.postDeleteBoard),
      map((props) => BoardsActions.deleteBoard({ boardId: props.boardId }))
    )
  );
}
