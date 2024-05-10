import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf, SlicePipe } from "@angular/common";
import { CardComponent } from "../../card/components/card/card.component";
import { Card } from "../../common/models/card";
import { GroupList } from '../../common/models/group-list';
import { Priority } from "../../common/models/priority";
import { FilterPipe } from "../../common/pipes/filter-pipe";
import { GroupListInfo } from "../../common/models/group-list-info";
import { NextCardsForGroupList } from "../../common/events/next-cards-for-group-list";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { sameValueValidator } from "../../common/validators/same-value-validator";
import { MatMenuModule } from "@angular/material/menu";
import { GroupListFormComponent } from "./group-list-form/group-list-form.component";

@Component({
  selector: 'app-group-list',
  standalone: true,
  imports: [
    NgForOf,
    CardComponent,
    FilterPipe,
    SlicePipe,
    MatButton,
    MatIcon,
    NgIf,
    AsyncPipe,
    NgClass,
    MatMenuModule,
    MatIconButton,
    GroupListFormComponent
  ],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.css'
})
export class GroupListComponent implements OnInit {
  @Input() cards!: Card[];
  @Input() groupList!: GroupList;
  @Input() anotherLists!: GroupListInfo[]
  @Input() priorities!: Priority[];
  @Output() cardInListUpdated = new EventEmitter<Partial<Card>>;
  @Output() cardInListRequestedEdit = new EventEmitter<number>;
  @Output() cardInListDeleted = new EventEmitter<number>;
  @Output() newCardsRequested = new EventEmitter<NextCardsForGroupList>;
  @Output() groupListUpdated = new EventEmitter<Partial<GroupList>>;
  @Output() groupListDeleted = new EventEmitter<number>;
  @Output() createCardRequested = new EventEmitter<number>;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      groupName: [
        this.groupList.name, [
          Validators.required,
          Validators.maxLength(100),
          sameValueValidator(this.groupList.name)
        ]
      ]
    });
  }

  protected editForm!: FormGroup;
  protected editRequested = false;

  protected onCreateCardRequested() {
    this.createCardRequested.emit(this.groupList.id);
  }

  protected onCardInListChanged($event: Partial<Card>) {
    this.cardInListUpdated.emit($event);
  }

  protected onCardInListRequestedEdit($event: number) {
    this.cardInListRequestedEdit.emit($event);
  }

  protected onCardInListDeleted($event: number) {
    this.cardInListDeleted.emit($event);
  }

  protected onNextCardsRequested() {
    this.newCardsRequested.emit({
      groupListId: this.groupList.id,
      nextPage: this.groupList.currentPage + 1
    });
  }

  protected onEditGroupList() {
    this.editRequested = true;
  }

  protected onDeleteGroupList() {
    this.groupListDeleted.emit(this.groupList.id);
  }

  protected onSaveEditGroupList() {
    this.groupListUpdated.emit({
      id: this.groupList.id,
      name: this.editForm.value.groupName
    });

    this.editRequested = false;
  }

  protected onCancelEdit() {
    this.editForm.reset({ groupName: this.groupList.name });
    this.editRequested = false;
  }
}
