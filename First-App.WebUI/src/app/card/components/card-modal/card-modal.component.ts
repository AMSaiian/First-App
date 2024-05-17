import { Component, Inject, OnInit } from '@angular/core';
import { CardFormComponent } from "../card-form/card-form.component";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";
import { Store } from "@ngrx/store";
import { PrioritiesFeature } from "../../../priorities/state/priorities.state";
import { GroupListInfo } from "../../../group-list/state/group-list-info";
import { Priority } from "../../../priorities/state/priority.model";
import { Card } from "../../state/card.model";
import { GroupListsFeature } from "../../../group-list/state/group-lists.state";

@Component({
  selector: 'app-card-modal',
  standalone: true,
  imports: [
    CardFormComponent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    AsyncPipe,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './card-modal.component.html',
  styleUrl: './card-modal.component.css'
})
export class CardModalComponent implements OnInit {
  protected title: string;
  protected form: FormGroup;
  protected priorities$!: Observable<Priority[]>;
  protected groupLists$!: Observable<GroupListInfo[]>;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { title: string, form: FormGroup},
              private modalRef: MatDialogRef<CardModalComponent>,
              private store: Store
  ) {
    this.title = data.title;
    this.form = data.form;
  }

  ngOnInit(): void {
    this.priorities$ = this.store.select(PrioritiesFeature.selectAll)
    this.groupLists$ = this.store.select(GroupListsFeature.selectAll)
  }

  public onSubmit() {
    this.modalRef.close({
      name: this.form.value.name,
      description: this.form.value.description,
      dueDate: this.form.value.dueDate,
      groupId: this.form.value.groupId,
      priorityId: this.form.value.priorityId
    } as Partial<Card>)
  }

  public onCancel() {
    this.modalRef.close();
  }
}
