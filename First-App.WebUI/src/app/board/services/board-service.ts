import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import { Board } from "../state/board.model";
import { BoardWithGroupListsDto } from "../../common/dtos/board-with-group-lists-dto";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { map } from "rxjs";
import { GroupList } from "../../group-list/state/group-list.model";
import { Card } from "../../card/state/card.model";

@Injectable({ providedIn: "root" })
export class BoardService {

  constructor(private http: HttpClient,
              private apiEndpoints: ApiEndpointsService
  ) {}

  public getBoards() {
    return this.http.get<Board[]>(this.apiEndpoints.getBoards());
  }

  public getBoardWithLists(boardId: number, paginationContext: PaginationContext) {
    return this.http.get<BoardWithGroupListsDto>(
      this.apiEndpoints.getBoardWithLists(boardId), {
        params: {
          ...paginationContext
        }
      }
    ).pipe(
      map((data) : [board: Board, groupLists: GroupList[], cards: Card[]] => {
        const board: Board = {
          id: data.id,
          name: data.name
        };

        const groupLists: GroupList[] = data.groupLists
          .map((dto): GroupList => ({
            id: dto.id,
            name: dto.name,
            boardId: board.id,
            currentPage: dto.cards.pagedInfo.pageNumber,
            hasNextCards: dto.cards.pagedInfo.totalPages > dto.cards.pagedInfo.pageNumber,
            cardsAmount: dto.cards.pagedInfo.totalRecords
          }));

        const cards: Card[] = data.groupLists
          .flatMap(group => group.cards.entities);

        return [board, groupLists, cards];
      })
    );
  }

  public createBoard(board: Partial<Board>) {
    return this.http.post<number>(this.apiEndpoints.createBoard(), board);
  }

  public updateBoard(board: Partial<Board>) {
    return this.http.put(this.apiEndpoints.updateBoard(board.id!), board);
  }

  public deleteBoard(boardId: number) {
    return this.http.delete(this.apiEndpoints.deleteBoard(boardId));
  }
}
