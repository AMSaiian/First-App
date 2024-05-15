import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf, SlicePipe } from "@angular/common";
import { CardComponent } from "../../../card/components/card/card.component";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { GroupListFormComponent } from "../group-list-form/group-list-form.component";
import { FormsService } from "../../../common/services/forms-service";
import { GroupList } from "../../state/group-list.model";
import { GroupListInfo } from "../../state/group-list-info";
import { Priority } from "../../../priorities/state/priority.model";
import { Observable, of } from "rxjs";
import { GroupListsFeature, GroupListsState } from "../../state/group-lists.state";
import { Store } from "@ngrx/store";
import { FilterPipe } from "../../../common/pipes/filter-pipe";
import { Card } from "../../../card/state/card.model";
import { PrioritiesFeature, PrioritiesState } from "../../../priorities/state/priorities.state";
import { CardsFeature, CardsState } from "../../../card/state/cards.state";

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
  cards$!: Observable<Card[]>;
  anotherLists$!: Observable<GroupListInfo[]>;
  priorities$!: Observable<Priority[]>;

  constructor(private readonly formsService: FormsService,
              private readonly groupListsStore: Store<GroupListsState>,
              private readonly prioritiesStore: Store<PrioritiesState>,
              private readonly cardsStore: Store<CardsState>
  ) {}

  ngOnInit(): void {
    this.cards$ = this.cardsStore
      .select(
        CardsFeature.selectCardsByListId(this.groupList.id)
      );

    this.anotherLists$ = this.groupListsStore
      .select(
        GroupListsFeature.selectAnotherGroupLists(this.groupList.id)
      );

    this.priorities$ = this.prioritiesStore
      .select(PrioritiesFeature.selectAll);
  }

  protected editForm!: FormGroup;
  protected editRequested = false;

  protected onCreateCard() {
  }

  protected onNextCards() {
  }

  protected onEdit() {
    this.editRequested = true;
  }

  protected onDelete() {
  }

  protected onSaveEdit() {

    this.editRequested = false;
  }

  protected onCancelEdit() {
    this.editForm.reset({ groupName: this.groupList.name });
    this.editRequested = false;
  }
}
