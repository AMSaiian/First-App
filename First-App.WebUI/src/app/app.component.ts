import {Component, OnDestroy, OnInit} from "@angular/core";
import {RouterOutlet} from "@angular/router";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {GroupListComponent} from "./group-list/components/group-list/group-list.component";
import {FilterPipe} from "./common/pipes/filter-pipe";
import {HttpClientModule} from "@angular/common/http";
import {GroupListService} from "./group-list/services/group-list-service";
import {first, mergeMap, Observable, Subject, takeUntil} from "rxjs";
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
import {ChangesService} from "./changes/services/changes-service";
import {HistoryComponent} from "./changes/components/history/history.component";
import {CardModalComponent} from "./card/components/card-modal/card-modal.component";
import {ErrorsService} from "./common/services/errors-service";
import {MatSnackBar} from "@angular/material/snack-bar";

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
    ChangesService,
    ErrorsService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'First-App.WebUI';

  public cards$!: Observable<Card[]>;
  public groupLists$!: Observable<GroupList[]>;
  public priorities$!: Observable<Priority[]>

  private unsubscribe$ = new Subject<void>;

  constructor(private groupListService: GroupListService,
              private prioritiesService: PrioritiesService,
              private paginationService: PaginationSizeService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private errorsService: ErrorsService) {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
    this.prioritiesService.getPriorities();
    this.groupListService.getInitGroupListsWithCards(this.paginationService.getCardsInGroupListAmount());
    this.cards$ = this.groupListService.cards$;
    this.groupLists$ = this.groupListService.groupLists$;
    this.priorities$ = this.prioritiesService.priorities$;

    this.errorsService.error$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((error) => {
        this.openErrorSnackBar(error);
      })

    this.createListForm = this.formBuilder.group({
      groupName: [
        '', [
          Validators.required,
          Validators.maxLength(300)
        ]
      ]
    });
  }

  public onViewHistoryRequested() {
    const dialogRef = this.dialog.open(HistoryComponent, {
      height: '100vh',
      width: '400px',
      position: { right: '0px' }
    })
  }

  public onCardCreateRequested($event: number) {
    const form = this.createCardForm({ groupId: $event });

    const dialogRef = this.dialog.open(CardModalComponent, {
      height: '600px',
      width: '600px',
      data: {
        title: "Create card",
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
          const form = this.createCardForm(cardToUpdate);

          return this.dialog.open(CardModalComponent, {
            height: '600px',
            width: '600px',
            data: {
              title: "Edit card",
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

  private openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['snackbar-error'],
      duration: 4000
    });
  }

  protected readonly compareGroupLists = compareGroupLists;
  protected readonly compareCards = compareCards;

  protected createListRequested = false;
  protected createListForm!: FormGroup;

  private createCardForm(initialValues: Partial<Card>): FormGroup {
    return this.formBuilder.group({
      cardName: [
        initialValues?.name ?? '', [
          Validators.required,
          Validators.maxLength(300)
        ]
      ],
      groupId: [
        initialValues?.groupId ?? '', [
          Validators.required
        ]
      ],
      priorityId: [
        initialValues?.priorityId ?? '', [
          Validators.required
        ]
      ],
      description: [
        initialValues?.description ?? '', [
          Validators.maxLength(2000)
        ]
      ],
      dueDate: [
        initialValues?.dueDate ?? '', [
          Validators.required
        ]
      ]
    });
  }
}