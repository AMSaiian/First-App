import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Priority } from "./priority.model";

export const PrioritiesActions = createActionGroup({
  source: "Priorities",
  events: {
    addPriorities: props<{ priorities: Priority[] }>(),
    apiGetPriorities: emptyProps()
  }
});
