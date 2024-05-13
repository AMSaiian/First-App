import { createActionGroup, props } from '@ngrx/store';
import { Change } from './change.model';

export const ChangesActions = createActionGroup({
  source: "Changes",
  events: {
    addChanges: props<{ changes: Change[] }>(),
    apiGetCardChanges: props<{ cardId: number }>(),
    apiGetBoardChanges: props<{ boardId: number }>()
  }
});
