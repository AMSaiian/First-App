import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, createFeature, createSelector } from "@ngrx/store";
import { CardsActions } from "./cards.actions";
import { Card } from './card.model';

export interface CardsState extends EntityState<Card> {
}

const adapter = createEntityAdapter<Card>();
const initialState = adapter.getInitialState();

export const CardsFeature = createFeature({
  name: "cards",
  reducer: createReducer(
    initialState,
    on(CardsActions.addCards, (state, { cards }) => adapter.addMany(cards, state)),
    on(CardsActions.addCard, (state, { card }) => adapter.addOne(card, state)),
    on(CardsActions.deleteCard, (state, { cardId }) => adapter.removeOne(cardId, state)),
    on(CardsActions.updateCard, (state, { cardChanges }) => adapter.updateOne(cardChanges, state))
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectCardsState),
    selectCardById: (id: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => entities[id] as Card
    ),
    selectCardsByListId: (listId: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => Object.values(entities).filter(entity => entity!.groupId === listId) as Card[]
    )
  })
});
