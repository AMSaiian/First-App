import { Injectable } from "@angular/core";
import { PrioritiesService } from "../services/priorities-service";
import { ErrorsService } from "../../common/services/errors-service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { PrioritiesActions } from "./priorities.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { ErrorsActions } from "../../common/actions/errors.actions";


@Injectable({ providedIn: "root" })
export class PrioritiesEffects {

  constructor(private readonly actions$: Actions,
              private readonly prioritiesService: PrioritiesService,
              private readonly errorsService: ErrorsService
  ) {}

  public readonly apiGetPriorities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PrioritiesActions.apiGetPriorities),
      exhaustMap(() => this.prioritiesService.getPriorities()
        .pipe(
          map(data => PrioritiesActions.addPriorities({ priorities: data })),
          catchError(error => of(ErrorsActions.raiseError({ message: this.errorsService.humaniseError(error.error) })))
        )
      )
    )
  );
}
