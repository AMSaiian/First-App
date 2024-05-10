import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class PaginationSizeService {
  private cardsInGroupListAmount: number = environment.pagination.cardsInGroupListAmount;
  private changesInHistoryAmount: number = environment.pagination.changesInHistoryAmount;

  public getCardsInGroupListAmount(): number {
    return this.cardsInGroupListAmount;
  }

  public getChangesInHistoryAmount(): number {
    return this.changesInHistoryAmount;
  }
}
