import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Board } from "./board.model";
import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { BoardsActions } from "./boards.actions";

export interface BoardsState extends EntityState<Board>{
}

const adapter = createEntityAdapter<Board>();
const initialState = adapter.getInitialState();

export const BoardsFeature = createFeature({
  name: "boards",
  reducer: createReducer(
    initialState,
    on(BoardsActions.addBoard, (state, { board }) => adapter.addOne(board as Board, state)),
    on(BoardsActions.addBoards, (state, { boards }) => adapter.addMany(boards, state)),
    on(BoardsActions.updateBoard, (state, { boardChanges }) => adapter.updateOne(boardChanges, state)),
    on(BoardsActions.deleteBoard, (state, { boardId }) => adapter.removeOne(boardId, state))
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectBoardsState),
    selectBoardById: (id: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => entities[id]
    )
  })
});
