import {Component, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {GroupListComponent} from "./group-list/components/group-list.component";
import {FilterPipe} from "./common/pipes/filter-pipe";
import {HttpClientModule} from "@angular/common/http";
import {GroupListService} from "./group-list/services/group-list-service";
import {filter, first, map, mergeMap, Observable, shareReplay, switchMap} from "rxjs";
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
import {MatDialog} from "@angular/material/dialog";
import {CreateCardModalComponent} from "./card/components/create-card-modal/create-card-modal.component";
import {C} from "@angular/cdk/keycodes";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe, GroupListComponent,
    FilterPipe, NgForOf, NgIf, HttpClientModule,
    MatGridListModule, NgClass, MatButtonModule,
    MatIconModule, GroupListFormComponent, MatMenu, MatMenuItem,
  ],
  providers: [
    GroupListService,
    ApiEndpointsService,
    PrioritiesService,
    PaginationSizeService,
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
              private formBuilder: FormBuilder,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.prioritiesService.getPriorities();
    this.groupListService.getInitGroupListsWithCards(this.paginationService.getCardsInGroupListAmount());
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

  public onCardCreateRequested($event: number) {
    const form = this.formBuilder.group({
      cardName: [
        '', [
          Validators.required,
          Validators.maxLength(300)
        ]
      ],
      groupId: [
        $event, [
          Validators.required
        ]
      ],
      priorityId: [
        1, [
          Validators.required
        ]
      ],
      description: [
        '', [
          Validators.maxLength(2000)
        ]
      ],
      dueDate: [
        '', [
          Validators.required
        ]
      ]
    });

    const dialogRef = this.dialog.open(CreateCardModalComponent, {
      height: '600px',
      width: '600px',
      data: {
        form: form,
        priorities$: this.priorities$,
        groupLists$: this.groupLists$,
      }
    })
      .afterClosed()
      .subscribe(data => {
        if (data !== undefined) {
          this.groupListService.createCard(data);
        }
      });
  }

  public onCardEditRequested($event: number) {
    this.cards$
      .pipe(first(),
        mergeMap(data => {
          const cardToUpdate = data.find(card => card.id === $event)!;
          const form = this.formBuilder.group({
            cardName: [
              cardToUpdate.name, [
                Validators.required,
                Validators.maxLength(300)
              ]
            ],
            groupId: [
              cardToUpdate.groupId, [
                Validators.required
              ]
            ],
            priorityId: [
              cardToUpdate.priorityId, [
                Validators.required
              ]
            ],
            description: [
              cardToUpdate.description, [
                Validators.maxLength(2000)
              ]
            ],
            dueDate: [
              cardToUpdate.dueDate, [
                Validators.required
              ]
            ]
          });

          return this.dialog.open(CreateCardModalComponent, {
            height: '600px',
            width: '600px',
            data: {
              form: form,
              priorities$: this.priorities$,
              groupLists$: this.groupLists$,
            }
          }).afterClosed()
        }))
      .subscribe(data => {
        if (data !== undefined) {
          this.groupListService.updateCard({...data, id: $event});
        }
      });
  }

  public onCardDeleted($event: number) {
    this.groupListService.deleteCard($event);
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
