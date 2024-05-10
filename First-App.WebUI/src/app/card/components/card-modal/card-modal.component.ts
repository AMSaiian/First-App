import {Component, Inject } from '@angular/core';
import {CardFormComponent} from "../card-form/card-form.component";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {Observable} from "rxjs";
import {Priority} from "../../../common/models/priority";
import {GroupListInfo} from "../../../common/models/group-list-info";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {AsyncPipe} from "@angular/common";
import {Card} from "../../../common/models/card";

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
export class CardModalComponent {
  protected title: string;
  protected form: FormGroup;
  protected priorities$: Observable<Priority[]>;
  protected groupLists$: Observable<GroupListInfo[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      title: string,
      form: FormGroup,
      priorities$: Observable<Priority[]>,
      groupLists$: Observable<GroupListInfo[]>
    },
    protected modalRef: MatDialogRef<CardModalComponent>
  ) {
    this.title = data.title;
    this.form = data.form;
    this.groupLists$ = data.groupLists$;
    this.priorities$ = data.priorities$;
  }

  public onSubmit() {
    this.modalRef.close({
      name: this.form.value.cardName,
      description: this.form.value.description,
      dueDate: new Date(this.form.value.dueDate),
      groupId: this.form.value.groupId,
      priorityId: this.form.value.priorityId
    } as Partial<Card>)
  }

  public onCancel() {
    this.modalRef.close();
  }
}
