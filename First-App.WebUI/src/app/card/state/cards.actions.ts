import { createActionGroup, props } from '@ngrx/store';
import { Card } from './card.model';
import { Update } from '@ngrx/entity';

export const CardsActions = createActionGroup({
  source: 'Cards',
  events: {
    addCards: props<{ cards: Card[] }>(),

    apiAddCard: props<{ card: Partial<Card> }>(),
    addCard: props<{ card: Card }>(),

    apiUpdateCard: props<{ id: number, changes: Partial<Card> }>(),
    beforeUpdateCard: props<{ card: Update<Card> }>(),
    updateCard: props<{ card: Update<Card> }>(),

    apiDeleteCard: props<{ cardId: number }>(),
    beforeDeleteCard: props<{ cardId: number }>(),
    deleteCard: props<{ cardId: number }>(),

    deleteCards: props<{ cardIds: number[] }>()
  },
});
