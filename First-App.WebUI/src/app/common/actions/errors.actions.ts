import { createActionGroup, props } from "@ngrx/store";

export const ErrorsActions = createActionGroup({
  source: "Errors",
  events: {
    raiseError: props<{ message:string }>()
  }
})
