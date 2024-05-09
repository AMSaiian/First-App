import {Component, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {GroupListComponent} from "./group-list/components/group-list.component";
import {FilterPipe} from "./common/pipes/filter-pipe";
import {HttpClientModule} from "@angular/common/http";
import {GroupListService} from "./group-list/services/group-list-service";
import {Observable} from "rxjs";
import {Card, compareCards} from "./common/models/card";
import {GroupList} from "./common/models/group-list";
import {ApiEndpointsService} from "./common/services/api-endpoints-service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {PrioritiesService} from "./priorities/services/priorities-service";
import {Priority} from "./common/models/priority";
import {compareGroupLists} from "./common/models/group-list-info";
import {PaginationSizeService} from "./common/services/pagination-size-service";
import {NextCardsForGroupList} from "./common/events/next-cards-for-group-list";
import {GroupListFormComponent} from "./group-list/components/group-list-form/group-list-form.component";
import {MatMenu, MatMenuItem} from "@angular/material/menu";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {sameValueValidator} from "./common/validators/same-value-validator";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule, GroupListFormComponent, MatMenu, MatMenuItem
  ],
  providers: [
    GroupListService,
    ApiEndpointsService,
    PrioritiesService,
    PaginationSizeService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'First-App.WebUI';

  public cards$!: Observable<Card[]>;
  public groupLists$!: Observable<GroupList[]>;
  public priorities$!: Observable<Priority[]>

  constructor(private groupListService: GroupListService,
              private prioritiesService: PrioritiesService,
              private paginationService: PaginationSizeService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.groupListService.getInitGroupListsWithCards(this.paginationService.getCardsInGroupListAmount());
    this.prioritiesService.getPriorities();
    this.cards$ = this.groupListService.cards$;
    this.groupLists$ = this.groupListService.groupLists$;
    this.priorities$ = this.prioritiesService.priorities$;

    this.createListForm = this.formBuilder.group({
      groupName: [
        '', [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });
  }

  public onCardUpdated($event: Partial<Card>): void {
    this.groupListService.updateCard($event);
  }

  public onGroupListUpdated($event: Partial<GroupList>) {
    this.groupListService.updateList($event);
  }

  public onGroupListDeleted($event: number) {
    this.groupListService.deleteList($event);
  }

  public onNextCardsForGroupListRequested($event: NextCardsForGroupList) {
    this.groupListService.getGroupListCards($event.groupListId, {
      pageNum: $event.nextPage,
      pageSize: this.paginationService.getCardsInGroupListAmount()
    });
  }

  public onCreateListRequested() {
    this.createListRequested = true;
  }

  public onCreateList() {
    this.groupListService.createList({ name: this.createListForm.value.groupName })
    this.createListRequested = false;
  }

  public onCancelCreateList() {
    this.createListForm.reset();
    this.createListRequested = false;
  }

  protected excludeGroupListById(excludeId: number) {
    return (card: Card) => card.id !== excludeId;
  }

  protected readonly compareGroupLists = compareGroupLists;
  protected readonly compareCards = compareCards;

  protected createListRequested = false;
  protected createListForm!: FormGroup;
}
