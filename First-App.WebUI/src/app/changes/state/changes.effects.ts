import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ChangesService } from "../services/changes-service";
import { ErrorsService } from "../../common/services/errors-service";
import { ChangesActions } from "./changes.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { ErrorsActions } from "../../common/actions/errors.actions";

@Injectable({ providedIn: "root" })
export class ChangesEffects {

  constructor(private readonly actions$: Actions,
              private readonly changesService: ChangesService,
              private readonly errorsService: ErrorsService
  ) {}

  public readonly apiGetCardChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangesActions.apiGetCardChanges),
      exhaustMap(props => this.changesService.getCardChanges(props.cardId, props.paginationContext)
        .pipe(
          map(changes => ChangesActions.addChanges({ changes: changes })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );

  public readonly apiGetBoardChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChangesActions.apiGetBoardChanges),
      exhaustMap(props => this.changesService.getBoardChanges(props.boardId, props.paginationContext)
        .pipe(
          map(changes => ChangesActions.addChanges({ changes: changes })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );
}
