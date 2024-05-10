import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ApiEndpointsService {
  private baseUrl: string = environment.baseUrl;
  private baseLists: string = "lists";
  private baseCards: string = "cards";
  private baseChanges: string = "changes";
  private basePriorities: string = "priorities"

  public getGroupListsWithCards(): string {
    return [this.baseUrl, this.baseLists].join('/');
  }

  public getGroupListCards(groupListId: number): string {
    return [this.baseUrl, this.baseLists, groupListId.toString(), this.baseCards].join('/');
  }

  public getPriorities(): string {
    return [this.baseUrl, this.basePriorities].join('/');
  }

  public createCard() {
    return [this.baseUrl, this.baseCards].join('/');
  }

  public updateCard(cardId: number) {
    return [this.baseUrl, this.baseCards, cardId.toString()].join('/');
  }

  public deleteCard(cardId: number) {
    return [this.baseUrl, this.baseCards, cardId.toString()].join('/');
  }

  public createGroupList() {
    return [this.baseUrl, this.baseLists].join('/');
  }

  public updateGroupList(groupListId: number) {
    return [this.baseUrl, this.baseLists, groupListId.toString()].join('/');
  }

  public deleteGroupList(groupListId: number) {
    return [this.baseUrl, this.baseLists, groupListId.toString()].join('/');
  }
}
