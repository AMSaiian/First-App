import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Board } from "./board.model";
import { Update } from "@ngrx/entity";
import { GroupList } from "../../group-list/state/group-list.model";
import { Card } from "../../card/state/card.model";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";

export const BoardsActions = createActionGroup({
  source: "Boards",
  events: {
    createBoard: props<{ board: Partial<Board> }>(),
    addBoard: props<{ board: Board }>(), //+
    addBoards: props<{ boards: Board[] }>(), //++

    updateBoard: props<{ boardChanges: Update<Board> }>(), //++

    beforeDeleteBoard: props<{ boardId: number }>(),
    postDeleteBoard: props<{ boardId: number }>(),
    deleteBoard: props<{ boardId: number }>(), //+

    apiGetBoards: emptyProps(),
    apiGetBoardWithLists: props<{ boardId: number, paginationContext: PaginationContext }>(),
    postApiGetBoardWithLists: props<{ board: Board, groupLists: GroupList[], cards: Card[] }>()
  }
})
