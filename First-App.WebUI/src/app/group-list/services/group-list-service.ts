import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import { GroupList } from "../../common/models/group-list";
import { Card } from "../../common/models/card";
import { GroupListWithCardsDto } from "../../common/dtos/group-list-with-cards-dto";
import { PaginationContext } from "../../common/dtos/pagination/pagination-context";
import { Paginated } from "../../common/dtos/pagination/paginated";
import { ApiEndpointsService } from "../../common/services/api-endpoints-service";
import {ErrorsService} from "../../common/services/errors-service";

@Injectable({ providedIn: "root" })
export class GroupListService {
  constructor(private http: HttpClient,
              private apiEndpoints: ApiEndpointsService,
              private errorsService: ErrorsService) {
  }

  private groupListsSubject: BehaviorSubject<GroupList[]> = new BehaviorSubject<GroupList[]>([]);
  private cardsSubject: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  public groupLists$: Observable<GroupList[]> = this.groupListsSubject.asObservable();
  public cards$: Observable<Card[]> = this.cardsSubject.asObservable();

  public getInitGroupListsWithCards(pageSize: number) {
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
      }, error => this.errorsService.setError("Something went wrong, try later"))
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
      }, error => this.errorsService.setError("Something went wrong, try later"))
  }

  public createCard(newCard: Partial<Card>) {
    this.http.post<number>(this.apiEndpoints.createCard(), {
      ...newCard,
      dueDate: newCard.dueDate?.toISOString().split('T')[0]
    })
      .pipe(map((data) : Card => ({
        id: data,
        name: newCard.name!,
        description: newCard.description!,
        dueDate: newCard.dueDate!,
        priorityId: newCard.priorityId!,
        groupId: newCard.groupId!
      })))
      .subscribe(data => {
        const previousStateCards = this.cardsSubject.value;
        this.cardsSubject.next([...previousStateCards, data]);
        this.handleGroupListCountChange(newCard.groupId!, true);
      }, error => this.errorsService.setError("Something went wrong, try later"))
  }

  public updateCard(changes: Partial<Card>) {
    this.http.put(this.apiEndpoints.updateCard(changes.id!), {
      ...changes, dueDate: changes.dueDate?.toISOString().split('T')[0]
    })
      .subscribe(() => {
        const previousCards = this.cardsSubject.value;
        const cardToUpdate: Card = previousCards.find(card => card.id === changes.id)!;
        const cardsWithoutUpdated = previousCards.filter(card => card.id !== changes.id);
        const updatedCard = {...cardToUpdate, ...changes};

        this.cardsSubject.next([...cardsWithoutUpdated, updatedCard]);

        if (changes?.groupId !== cardToUpdate.groupId) {
          this.handleGroupListSwitch(cardToUpdate.groupId, updatedCard.groupId);
        }
      }, error => this.errorsService.setError("Something went wrong, try later"));
  }

  public deleteCard(cardId: number) {
    this.http.delete(this.apiEndpoints.deleteCard(cardId))
      .subscribe(() => {
        const cardToDelete = this.cardsSubject.value
          .find(card => card.id === cardId)!;
        const cardsWithoutDeleted = this.cardsSubject.value
          .filter(card => card.id !== cardId);

        this.cardsSubject.next(cardsWithoutDeleted);
        this.handleGroupListCountChange(cardToDelete.groupId, false);
      }, error => this.errorsService.setError("Something went wrong, try later"))
  }

  public createList(newList: Partial<GroupList>) {
    this.http.post<number>(this.apiEndpoints.createGroupList(), newList)
      .pipe(map((data): GroupList => ({
          id: data,
          name: newList.name!,
          hasNextCards: false,
          currentPage: 1,
          cardsAmount: 0
        }))
      )
      .subscribe(data => {
        const previousState = this.groupListsSubject.value;
        this.groupListsSubject.next([...previousState, data]);
      }, error => this.errorsService.setError("Something went wrong, try later"));
  }

  public updateList(changes: Partial<GroupList>) {
    this.http.put(this.apiEndpoints.updateGroupList(changes.id!), changes)
      .subscribe(() => {
        const previousLists = this.groupListsSubject.value;
        const listToUpdate = previousLists.find(list => list.id === changes.id)!;
        const listsWithoutUpdated = previousLists.filter(list => list.id !== changes.id);
        const updatedList = { ...listToUpdate, ...changes };

        this.groupListsSubject.next([...listsWithoutUpdated, updatedList]);
      }, error => this.errorsService.setError("Something went wrong, try later"));
  }

  public deleteList(listId: number) {
    this.http.delete(this.apiEndpoints.deleteGroupList(listId))
      .subscribe(() => {
        const listsWithoutDeleted = this.groupListsSubject.value
          .filter(list => list.id !== listId);
        this.groupListsSubject.next(listsWithoutDeleted);

        const cardsWithoutDeletedWithList = this.cardsSubject.value
          .filter(card => card.groupId !== listId);
        this.cardsSubject.next(cardsWithoutDeletedWithList);
      }, error => this.errorsService.setError("Something went wrong, try later"));
  }

  private handleGroupListSwitch(fromListId: number, toListId: number) {
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

  private handleGroupListCountChange(listId: number, increment: boolean) {
    const oldState = this.groupListsSubject.value
    let previousList = oldState.find(list => list.id === listId)!;

    previousList = { ...previousList,
      cardsAmount: increment
        ? previousList.cardsAmount + 1
        : previousList.cardsAmount - 1
    };

    this.groupListsSubject.next([
      ...oldState
        .filter(list => list.id !== listId),
      previousList
    ]);
  }
}
