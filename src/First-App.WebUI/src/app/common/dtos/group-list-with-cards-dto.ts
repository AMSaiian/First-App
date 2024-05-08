import { Card } from "../models/card";
import { Paginated } from "./pagination/paginated";

export interface GroupListWithCardsDto {
  id: number,
  name: string,
  cards: Paginated<Card>
}
