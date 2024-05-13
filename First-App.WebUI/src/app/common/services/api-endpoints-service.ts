import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ApiEndpointsService {
  private baseUrl: string = environment.baseUrl;
  private baseBoards: string = "boards";
  private baseLists: string = "lists";
  private baseCards: string = "cards";
  private basePriorities: string = "priorities"
  private baseChanges: string = "changes";

  public getBoards(): string {
    return [this.baseUrl, this.baseBoards].join('/');
  }

  public getBoardWithLists(boardId: number): string {
    return [this.baseUrl, this.baseBoards, boardId.toString()].join('/');
  }

  public getBoardChanges(boardId: number) {
    return [this.baseUrl, this.baseBoards, boardId.toString(), this.baseChanges].join('/');
  }

  public createBoard(): string {
    return [this.baseUrl, this.baseBoards].join('/');
  }

  public updateBoard(boardId: number): string {
    return [this.baseUrl, this.baseBoards, boardId.toString()].join('/');
  }

  public deleteBoard(boardId: number): string {
    return [this.baseUrl, this.baseBoards, boardId.toString()].join('/');
  }

  public getGroupListCards(groupListId: number): string {
    return [this.baseUrl, this.baseLists, groupListId.toString(), this.baseCards].join('/');
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

  public createCard() {
    return [this.baseUrl, this.baseCards].join('/');
  }

  public updateCard(cardId: number) {
    return [this.baseUrl, this.baseCards, cardId.toString()].join('/');
  }

  public deleteCard(cardId: number) {
    return [this.baseUrl, this.baseCards, cardId.toString()].join('/');
  }

  public getCardChanges(cardId: number) {
    return [this.baseUrl, this.baseCards, cardId.toString(), this.baseChanges].join('/');
  }

  public getPriorities(): string {
    return [this.baseUrl, this.basePriorities].join('/');
  }
}
