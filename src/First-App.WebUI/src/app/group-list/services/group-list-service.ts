import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { GroupList } from "../../common/models/group-list";
import { Card, compareCards } from "../../common/models/card";
import { GroupListWithCardsDto } from "../../common/dtos/group-list-with-cards-dto";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { Paginated } from "../../common/dtos/pagination/paginated";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";

@Injectable({ providedIn: "root" })
export class GroupListService {
  constructor(private http: HttpClient, private apiEndpoints: ApiEndpointsService) {
  }

  private groupListsSubject: BehaviorSubject<GroupList[]> = new BehaviorSubject<GroupList[]>([]);
  private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  public groupLists$: Observable<GroupList[]> = this.groupListsSubject.asObservable();
  public cards$: Observable<Card[]> = this.cardsSubject.asObservable();

  public getInitGroupListsWithCards(pageSize: number = 2) {
    this.http.get<GroupListWithCardsDto[]>(this.apiEndpoints.getGroupListsWithCards(), {
      params: {
        pageNum: 1,
        pageSize: pageSize
      }
    })
      .pipe(map((data): [groupLists: GroupList[], cards: Card[]] => {
        const groupList: GroupList[] = data
          .map(dto => ({
            id: dto.id,
            name: dto.name,
            cardsAmount: dto.cards.pagedInfo.totalRecords,
            hasNextCards: dto.cards.pagedInfo.totalPages > 1 })
          )

        const cardList: Card[] = data
          .flatMap(dto => dto.cards.entities);

          return [groupList, cardList];
      }))
      .subscribe(([groupLists, cards]) => {
        this.groupListsSubject.next(groupLists);
        this.cardsSubject.next(cards);
      })
  }

  public getGroupListCards(groupListId: number, paginationContext: PaginationContext) {
    this.http.get<Paginated<Card>>(this.apiEndpoints.getGroupListCards(groupListId), {
      params: {
        pageSize: paginationContext.pageSize,
        pageNum: paginationContext.pageNum
      }
    })
      .pipe(map((data): [totalPages: number, totalRecords: number, cards: Card[]] =>
        [data.pagedInfo.totalPages, data.pagedInfo.totalRecords, data.entities])
      )
      .subscribe(([totalPages, totalRecords, cards]) => {
        const updatedGroupLists = this.groupListsSubject.value
          .map(groupList => {
            if (groupList.id === groupListId) {
              return {
                ...groupList,
                HasNextCards: totalPages > paginationContext.pageNum,
                CardsAmount: totalRecords
              }
            }
            else {
              return groupList;
            }
          })
        this.groupListsSubject.next(updatedGroupLists);
        this.cardsSubject.next(
          this.cardsSubject.value
            .concat(cards)
            .sort((a, b) => compareCards(a, b))
        );
      })
  }
}
