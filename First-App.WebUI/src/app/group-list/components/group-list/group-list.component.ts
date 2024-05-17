import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf, SlicePipe } from "@angular/common";
import { CardComponent } from "../../../card/components/card/card.component";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { FormGroup } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { GroupListFormComponent } from "../group-list-form/group-list-form.component";
import { FormsService } from "../../../common/services/forms-service";
import { GroupList } from "../../state/group-list.model";
import { GroupListInfo } from "../../state/group-list-info";
import { GroupListsActions } from "../../state/group-lists.actions"
import { Priority } from "../../../priorities/state/priority.model";
import { Observable, take } from "rxjs";
import { GroupListsFeature, GroupListsState } from "../../state/group-lists.state";
import { Store } from "@ngrx/store";
import { FilterPipe } from "../../../common/pipes/filter-pipe";
import { Card, compareCards } from "../../../card/state/card.model";
import { PrioritiesFeature, PrioritiesState } from "../../../priorities/state/priorities.state";
import { CardsFeature, CardsState } from "../../../card/state/cards.state";
import { MatDialog } from "@angular/material/dialog";
import { CardModalComponent } from "../../../card/components/card-modal/card-modal.component";
import { CardsActions } from "../../../card/state/cards.actions";
import { PaginationSizeService } from "../../../common/services/pagination-size-service";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    NgForOf,
    CardComponent,
    SlicePipe,
    MatButton,
    MatIcon,
    NgIf,
    AsyncPipe,
    NgClass,
    MatMenuModule,
    MatIconButton,
    GroupListFormComponent,
    FilterPipe
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit {
  @Input() groupList!: GroupList;
  public cards$!: Observable<Card[]>;
  public anotherLists$!: Observable<GroupListInfo[]>;
  public priorities$!: Observable<Priority[]>;

  public editListForm!: FormGroup;
  private createCardForm!: FormGroup;
  public editRequested = false;

  constructor(private readonly formsService: FormsService,
              private readonly store: Store<GroupListsState>,
              private readonly dialog: MatDialog,
              private readonly paginationService: PaginationSizeService
  ) {}

  ngOnInit(): void {
    this.cards$ = this.store
      .select(
        CardsFeature.selectCardsByListId(this.groupList.id)
      );

    this.anotherLists$ = this.store
      .select(
        GroupListsFeature.selectAnotherGroupLists(this.groupList.id)
      );

    this.priorities$ = this.store
      .select(PrioritiesFeature.selectAll);

    this.editListForm = this.formsService.createGroupListForm({ name: this.groupList.name });
  }

  protected onCreateCard() {
    const dialogRef = this.dialog.open(CardModalComponent, {
      height: '600px',
      width: '600px',
      data: {
        title: "Create card",
        form: this.formsService.createCardForm({ groupId: this.groupList.id })
      }
    })
      .afterClosed()
      .subscribe(data => {
        if (data !== undefined) {
          this.store.dispatch(CardsActions.apiAddCard({ card: data }));
        }
      });
  }

  protected onNextCards() {
    this.store.select(
      GroupListsFeature.selectGroupListById(this.groupList.id)
    ).pipe(take(1)).subscribe(groupList => {
      this.store.dispatch(GroupListsActions.apiGetListCards({
        listId: this.groupList.id,
        paginationContext: {
          pageNum: groupList!.currentPage + 1,
          pageSize: this.paginationService.getCardsInGroupListAmount()
        }
      }))
    });
  }

  protected onEdit() {
    this.editRequested = true;
  }

  protected onDelete() {
    this.store.dispatch(GroupListsActions.apiDeleteList({ listId: this.groupList.id }));
  }

  protected onSaveEdit() {
    this.store.dispatch(GroupListsActions.apiUpdateList({
      id: this.groupList.id,
      changes: {
        name: this.editListForm.value.name
      }
    }));
    this.editRequested = false;
  }

  protected onCancelEdit() {
    this.editListForm.reset({ groupName: this.groupList.name });
    this.editRequested = false;
  }
}
