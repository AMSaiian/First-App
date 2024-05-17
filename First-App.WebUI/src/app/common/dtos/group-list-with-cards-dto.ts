import { Card } from "../../card/state/card.model";
import { Paginated } from "./pagination/paginated";

export interface GroupListWithCardsDto {
  id: number,
  name: string,
  cards: Paginated<Card>
}
