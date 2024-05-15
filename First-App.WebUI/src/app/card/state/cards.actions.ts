import { createActionGroup, props } from '@ngrx/store';
import { Card } from './card.model';
import { Update } from '@ngrx/entity';

export const CardsActions = createActionGroup({
  source: 'Cards',
  events: {
    addCards: props<{ cards: Card[] }>(),

    beforeAddCard: props<{ card: Partial<Card> }>(),
    postAddCard: props<{ card: Card }>(),
    addCard: props<{ card: Card }>(),

    beforeUpdateCard: props<{ cardChanges: Update<Card> }>(),
    postUpdateCard: props<{ cardChanges: Update<Card> }>(),
    updateCard: props<{ cardChanges: Update<Card> }>(),

    beforeDeleteCard: props<{ cardId: number }>(),
    postDeleteCard: props<{ cardId: number }>(),
    deleteCard: props<{ cardId: number }>()
  },
});
