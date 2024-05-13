import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Change } from "./change.model";
import { ChangesActions } from "./changes.actions";
import { createFeature, createReducer, on } from "@ngrx/store";

export interface State extends EntityState<Change> {
}

const adapter = createEntityAdapter<Change>();
const initialState: State = adapter.getInitialState();

export const ChangesFeature = createFeature({
  name: "changes",
  reducer: createReducer(
    initialState,
    on(ChangesActions.addChanges, (state, { changes }) => adapter.addMany(changes, state))
  )
});
