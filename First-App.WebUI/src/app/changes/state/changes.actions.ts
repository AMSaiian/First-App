import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Change } from './change.model';
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { Paginated } from "../../common/dtos/pagination/paginated";

export const ChangesActions = createActionGroup({
  source: "Changes",
  events: {
    resetChanges: emptyProps(),
    incrementPageNum: emptyProps(),

    addChanges: props<{ changes: Paginated<Change> }>(),

    apiGetCardChanges: props<{ cardId: number, paginationContext: PaginationContext }>(),
    apiGetBoardChanges: props<{ boardId: number, paginationContext: PaginationContext }>()
  }
});
