import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Change } from "./change.model";
import { ChangesActions } from "./changes.actions";
import { createFeature, createReducer, on } from "@ngrx/store";

export interface ChangesState extends EntityState<Change> {
  hasNextChanges: boolean,
  currentPage: number
}

const adapter = createEntityAdapter<Change>();
const initialState = adapter.getInitialState({
  hasNextChanges: true,
  currentPage: 1
});

export const ChangesFeature = createFeature({
  name: "changes",
  reducer: createReducer(
    initialState,
    on(ChangesActions.addChanges, (state, { changes }) => ({
      ...adapter.setAll(changes.entities, state),
      hasNextChanges: changes.pagedInfo.totalPages > changes.pagedInfo.pageNumber,
      currentPage: changes.pagedInfo.pageNumber
    }))
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectChangesState)
  })
});
