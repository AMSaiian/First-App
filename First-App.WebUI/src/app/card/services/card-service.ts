import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import { Card } from "../state/card.model";

@Injectable({ providedIn: "root" })
export class CardService {
  constructor(private readonly http: HttpClient,
              private readonly apiEndpoints: ApiEndpointsService
  ) {}

  public createCard(newCard: Partial<Card>) {
    return this.http.post<number>(this.apiEndpoints.createCard(), {
      ...newCard,
    });
  }

  public updateCard(id: number, changes: Partial<Card>) {
    return this.http.put(this.apiEndpoints.updateCard(id), {
      ...changes,
      id,
    } as Partial<Card>);
  }

  public deleteCard(cardId: number) {
    return this.http.delete(this.apiEndpoints.deleteCard(cardId));
  }
}
