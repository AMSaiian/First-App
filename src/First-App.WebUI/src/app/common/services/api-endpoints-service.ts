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

  public getGroupListCards(groupListId: number) {
    return [this.baseUrl, this.baseLists, groupListId.toString(), this.baseCards].join('/');
  }
}
