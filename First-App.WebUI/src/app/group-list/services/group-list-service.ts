import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { Paginated } from "../../common/dtos/pagination/paginated";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import { Card } from "../../card/state/card.model";
import { GroupList } from "../state/group-list.model";

@Injectable({ providedIn: "root" })
export class GroupListService {

  constructor(private readonly http: HttpClient,
              private readonly apiEndpoints: ApiEndpointsService
  ) {}

  public getGroupListCards(groupListId: number, paginationContext: PaginationContext) {
    return this.http.get<Paginated<Card>>(this.apiEndpoints.getGroupListCards(groupListId), {
      params: {
        ...paginationContext
      }
    });
  }

  public createList(newList: Partial<GroupList>) {
    return this.http.post<number>(this.apiEndpoints.createGroupList(), newList);
  }

  public updateList(id: number, changes: Partial<GroupList>) {
    return this.http.put(this.apiEndpoints.updateGroupList(id), { ...changes, id } as Partial<GroupList>);
  }

  public deleteList(id: number) {
    return this.http.delete(this.apiEndpoints.deleteGroupList(id));
  }
}
