import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { GroupList } from "../../common/models/group-list";
import { Card } from "../../common/models/card";
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
            hasNextCards: dto.cards.pagedInfo.totalPages > 1,
            currentPage: 1 })
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
      .pipe(map((data): [totalPages: number, totalRecords: number, currentPage: number, cards: Card[]] =>
        [data.pagedInfo.totalPages, data.pagedInfo.totalRecords, data.pagedInfo.pageNumber, data.entities])
      )
      .subscribe(([totalPages, totalRecords, currentPage , cards]) => {
        const updatedGroupLists = this.groupListsSubject.value
          .map(groupList => {
            if (groupList.id === groupListId) {
              return {
                ...groupList,
                hasNextCards: totalPages > paginationContext.pageNum,
                currentPage: currentPage,
                cardsAmount: totalRecords
              }
            }
            else {
              return groupList;
            }
          })
        this.groupListsSubject.next(updatedGroupLists);
        const mergedCards = this.cardsSubject.value
          .concat(cards);
        this.cardsSubject.next(Array.from(
          mergedCards.reduce((map, card) => {
            map.set(card.id, card);
            return map;
          }, new Map<number, Card>()).values())
        );
      })
  }

  public updateCard(changes: Partial<Card>) {
    this.http.put(this.apiEndpoints.updateCard(changes.id!), changes)
      .subscribe(() => {
        const previousCards = this.cardsSubject.value;
        const cardToUpdate: Card = previousCards.find(card => card.id === changes.id)!;
        const cardsWithoutUpdated = previousCards.filter(card => card.id !== changes.id);
        const updatedCard = {...cardToUpdate, ...changes};

        this.cardsSubject.next([...cardsWithoutUpdated, updatedCard]);

        if (changes.id !== null) {
          this.handleGroupListCountChanges(cardToUpdate.groupId, updatedCard.groupId);
        }
      });
  }

  private handleGroupListCountChanges(fromListId: number, toListId: number) {
    const oldState = this.groupListsSubject.value
    let previousList = oldState.find(list => list.id === fromListId)!;
    let newList = oldState.find(list => list.id === toListId)!;

    previousList = { ...previousList, cardsAmount: previousList.cardsAmount - 1 };
    newList = { ...newList, cardsAmount: newList.cardsAmount + 1 };

    this.groupListsSubject.next([
      ...oldState
        .filter(list => (list.id !== fromListId && list.id !== toListId)),
      previousList, newList
    ]);
  }
}
