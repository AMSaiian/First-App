import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { Paginated } from "../../common/dtos/pagination/paginated";
import { ErrorsService } from "../../common/services/errors-service";
import { Change } from "../state/change.model";

@Injectable({ providedIn: "root" })
export class ChangesService {

  constructor(private http: HttpClient,
              private apiEndpoints: ApiEndpointsService,
              private errorsService: ErrorsService) {
  }

  public getBoardChanges(boardId: number, paginationContext: PaginationContext) {
    return this.http.get<Paginated<Change>>(this.apiEndpoints.getBoardChanges(boardId), {
      params: {
        ...paginationContext
      }
    });
  }

  public getCardChanges(cardId: number, paginationContext: PaginationContext) {
    return this.http.get<Paginated<Change>>(this.apiEndpoints.getCardChanges(cardId), {
      params: {
        ...paginationContext
      }
    });
  }
}
