import { createActionGroup, props } from '@ngrx/store';
import { Card } from './card.model';
import { Update } from '@ngrx/entity';

export const CardsActions = createActionGroup({
  source: 'Cards',
  events: {
    addCards: props<{ cards: Card[] }>(),
    addCard: props<{ card: Card }>(),
    updateCard: props<{ cardChanges: Update<Card> }>(),
    beforeDeleteCard: props<{ cardId: number }>(),
    deleteCard: props<{ cardId: number }>()
  },
});
