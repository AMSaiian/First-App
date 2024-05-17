import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, createFeature, createSelector } from "@ngrx/store";
import { CardsActions } from "./cards.actions";
import { Card, compareCards } from './card.model';

export interface CardsState extends EntityState<Card> {
}

const adapter = createEntityAdapter<Card>();
const initialState = adapter.getInitialState();

export const CardsFeature = createFeature({
  name: "cards",
  reducer: createReducer(
    initialState,
    on(CardsActions.addCards, (state, { cards }) =>
      adapter.setMany(cards.map(card => ({
          ...card,
          dueDate: new Date(card.dueDate)
      })), state)
    ),
    on(CardsActions.addCard, (state, { card }) => adapter.addOne(card, state)),
    on(CardsActions.deleteCard, (state, { cardId }) => adapter.removeOne(cardId, state)),
    on(CardsActions.deleteCards, (state, { cardIds }) => adapter.removeMany(cardIds, state)),
    on(CardsActions.updateCard, (state, { card }) => adapter.updateOne(card, state))
  ),
  extraSelectors: baseSelectors => ({
    ...adapter.getSelectors(baseSelectors.selectCardsState),
    selectCardById: (id: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => entities[id] as Card
    ),
    selectCardsByListId: (listId: number) => createSelector(
      baseSelectors.selectEntities,
      (entities) => (Object.values(entities)
        .filter(entity => entity!.groupId === listId) as Card[])
        .sort(compareCards)
    ),
    selectCardsByListIds: (listIds: number[]) => createSelector(
      baseSelectors.selectEntities,
      (entities) => Object.values(entities).filter(entity => listIds.includes(entity!.groupId)) as Card[]
    )
  })
});
