import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Board } from "./board.model";
import { Update } from "@ngrx/entity";

export const BoardsActions = createActionGroup({
  source: "Boards",
  events: {
    addBoard: props<{ board: Board }>(),
    addBoards: props<{ boards: Board[] }>(),
    updateBoard: props<{ boardChanges: Update<Board> }>(),
    beforeDeleteBoard: props<{ boardId: number }>(),
    deleteBoard: props<{ boardId: number }>(),
    apiGetBoards: emptyProps(),
    apiGetBoardWithLists: props<{ boardId: number }>()
  }
})
