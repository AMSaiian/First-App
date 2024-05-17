import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ErrorsActions } from "../actions/errors.actions";
import { map } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({ providedIn: "root" })
export class ErrorsEffects {

  constructor(private readonly actions$: Actions,
              private readonly snackBar: MatSnackBar) {}

  raiseError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ErrorsActions.raiseError),
      map(props =>
        this.snackBar.open(props.message, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error'],
          duration: 4000
        })
      )
    ), { dispatch: false }
  )
}
