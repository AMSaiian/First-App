import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Priority } from "./priority.model";
import { createFeature, createReducer, on } from "@ngrx/store";
import { PrioritiesActions } from "./priorities.actions";

export interface PrioritiesState extends EntityState<Priority>{
}

const adapter = createEntityAdapter<Priority>();
const initialState = adapter.getInitialState();

export const PrioritiesFeature = createFeature({
  name: "priorities",
  reducer: createReducer(
    initialState,
    on(PrioritiesActions.addPriorities, (state, { priorities }) => adapter.addMany(priorities, state))
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectPrioritiesState)
  })
});
